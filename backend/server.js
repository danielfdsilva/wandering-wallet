import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

import authRoutes from './routes/auth.js';
import createExpensesRouter from './routes/expenses.js';
import { initConfig } from './config.js';

dotenv.config();

const { googleServiceAccountData, appConfigData } = await initConfig();

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
];

const jwt = new JWT({
  email: googleServiceAccountData.client_email,
  key: googleServiceAccountData.private_key,
  scopes: SCOPES
});

// Initialize Google Sheets document
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);

const app = express();
app.use(cors());
app.use(express.json());

// Setup route
app.get('/api/setup', async (req, res) => {
  try {
    res.status(200).json({
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      participants: appConfigData.participants.map((p) => p.name),
      tripName: doc.title,
      currencies: appConfigData.currencies,
      splits: appConfigData.splits
    });
  } catch (error) {
    console.error('Error setting up application:', error);
    res.status(500).json({ error: 'Failed to setup application' });
  }
});
// Auth routes
app.use('/api/auth', authRoutes);
// Expenses routes
app.use('/api/expenses', createExpensesRouter(doc));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
