// backend/routes/expenses.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

export default (doc) => {
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { amount, description, category, date, currency, participants } = req.body;

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

      res.status(200).json({ message: 'Expense added successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to add expense' });
    }
  });

  return router;
};
