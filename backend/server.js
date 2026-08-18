import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

import authRoutes from './routes/auth.js';
import createExpensesRouter from './routes/expenses.js';
import { initConfig } from './config.js';
import { sheetStatus } from './lib/sheet-status.js';

dotenv.config();

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  const { googleServiceAccountData } = await initConfig();

  const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ];

  const jwt = new JWT({
    email: googleServiceAccountData.client_email,
    key: googleServiceAccountData.private_key,
    scopes: SCOPES
  });

  const doc = process.env.GOOGLE_SHEET_ID
    ? new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt)
    : null;

  sheetStatus.configured = Boolean(doc);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    const healthy = !sheetStatus.configured || sheetStatus.ok;
    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'ok' : 'degraded',
      sheetConfigured: sheetStatus.configured,
      sheetOk: sheetStatus.ok,
      error: sheetStatus.error
    });
  });

  app.get('/api/setup', async (req, res) => {
    try {
      const { appConfigData } = await initConfig();
      if (doc && !doc.title) {
        await doc.loadInfo();
      }
      res.status(200).json({
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        participants: appConfigData.participants.map((p) => p.name),
        tripName: doc?.title ?? null,
        currencies: appConfigData.currencies,
        splits: appConfigData.splits
      });
    } catch (error) {
      console.error('Error setting up application:', error);
      res.status(500).json({ error: 'Failed to setup application' });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/expenses', createExpensesRouter(doc));

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
