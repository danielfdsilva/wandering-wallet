// backend/routes/expenses.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { initConfig } from '../config.js';

const router = express.Router();

const { googleServiceAccountData } = await initConfig();

export default (doc) => {
  const docCategories = new Set();
  const refreshCategories = async () => {
    try {
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const cells = await sheet.getCellsInRange('B2:B1000');
      (cells || []).flat().forEach((cell) => docCategories.add(cell));
    } catch (error) {
      if (error.message.includes('The caller does not have permission')) {
        console.log('\nUnauthorized access to Google Sheet.');
        console.log(
          'Make sure the Google Service Account bot has the needed access.'
        );
        console.log('Share the Sheet with:');
        console.log('');
        console.log('  Bot email:', googleServiceAccountData.client_email);
        console.log(
          '  Sheet URL:',
          `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`,
          '\n'
        );

        process.exit(1);
      }
      console.error('Error refreshing categories:', error);
    }
  };

  // Refresh categories on server start
  refreshCategories();
  // Set an interval to refresh categories every 2 minutes
  setInterval(refreshCategories, 2 * 60 * 1000);

  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { amount, description, category, date, currency, participants } =
        req.body;

      // Load the document
      await doc.loadInfo();

      // Get the first sheet
      const sheet = doc.sheetsByIndex[0];

      // Add the expense row
      await sheet.addRow({
        Timestamp: Date.now(),
        Categoria: category,
        Participantes: participants,
        Valor: amount,
        Date: date,
        Notas: description,
        Moeda: currency
      });

      // Add the category to the set if it doesn't exist.
      docCategories.add(category);

      res.status(200).json({ message: 'Expense added successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to add expense' });
    }
  });

  router.get('/categories', authenticateToken, async (req, res) => {
    const catList = Array.from(docCategories).sort((a, b) =>
      a.localeCompare(b)
    );

    return res.json(catList);
  });

  return router;
};
