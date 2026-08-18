import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { initConfig } from '../config.js';
import { validateExpense } from '../lib/validate-expense.js';
import { sheetStatus } from '../lib/sheet-status.js';
import {
  firstAvailableSheetRow
} from '../lib/sheet-rows.js';

const router = express.Router();

const NO_TRIP = (res) =>
  res.status(503).json({ error: 'No active trip configured' });

export default (doc) => {
  const docCategories = new Set();
  const refreshCategories = async () => {
    try {
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const cells = await sheet.getCellsInRange('B2:B1000');
      (cells || []).flat().forEach((cell) => docCategories.add(cell));
      sheetStatus.ok = true;
      sheetStatus.error = null;
    } catch (error) {
      sheetStatus.ok = false;
      sheetStatus.error = error.message;
      if (error.message.includes('The caller does not have permission')) {
        const { googleServiceAccountData } = await initConfig();
        console.error('\nUnauthorized access to Google Sheet.');
        console.error(
          'Make sure the Google Service Account bot has the needed access.'
        );
        console.error('Share the Sheet with:');
        console.error('');
        console.error('  Bot email:', googleServiceAccountData.client_email);
        console.error(
          '  Sheet URL:',
          `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`,
          '\n'
        );
        return;
      }
      console.error('Error refreshing categories:', error);
    }
  };

  if (doc) {
    sheetStatus.configured = true;
    // Refresh categories on server start
    refreshCategories();
    // Set an interval to refresh categories every 2 minutes
    setInterval(refreshCategories, 2 * 60 * 1000);
  }

  router.post('/', authenticateToken, async (req, res) => {
    if (!doc) return NO_TRIP(res);
    const parsed = validateExpense(req.body);
    if (!parsed.ok) {
      return res.status(400).json({ error: parsed.error });
    }

    try {
      const { amount, description, category, date, currency, participants } =
        parsed.value;

      // Load the document
      await doc.loadInfo();

      // Get the first sheet
      const sheet = doc.sheetsByIndex[0];
      await sheet.loadHeaderRow();

      const rowValues = {
        // A timestamp is mandatory.
        Timestamp: Date.now(),
        Categoria: category,
        Participantes: participants,
        Valor: amount,
        Data: date,
        Notas: description,
        Moeda: currency,
        Autor: req.user.name
      };

      // addRow appends after the used range and skips empty rows in between.
      // Column A is Timestamp; first blank cell from row 2 is the next slot.
      const occupied = await sheet.getCellsInRange('A2:A5000');
      const sheetRow = firstAvailableSheetRow(occupied);

      if (sheetRow > sheet.rowCount) {
        await sheet.resize({ rowCount: sheetRow });
      }

      // Write into that row (0-based indexes for the cells API)
      await sheet.loadCells({
        startRowIndex: sheetRow - 1,
        endRowIndex: sheetRow,
        startColumnIndex: 0,
        endColumnIndex: sheet.headerValues.length
      });

      sheet.headerValues.forEach((header, colIndex) => {
        if (rowValues[header] === undefined) return;
        sheet.getCell(sheetRow - 1, colIndex).value = rowValues[header];
      });
      await sheet.saveUpdatedCells();

      // Add the category to the set if it doesn't exist.
      docCategories.add(category);
      sheetStatus.ok = true;
      sheetStatus.error = null;

      res.status(200).json({ message: 'Expense added successfully' });
    } catch (error) {
      console.error('Error:', error);
      sheetStatus.ok = false;
      sheetStatus.error = error.message;
      res.status(500).json({ error: 'Failed to add expense' });
    }
  });

  router.get('/categories', authenticateToken, async (req, res) => {
    if (!doc) return NO_TRIP(res);

    const catList = Array.from(docCategories).sort((a, b) =>
      a.localeCompare(b)
    );

    return res.json(catList);
  });

  return router;
};
