import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { GOOGLE_SERVICE_ACCOUNT_FILE, APP_CONFIG_FILE } = process.env;

let googleServiceAccountData = null;
let appConfigData = null;

export async function initConfig() {
  if (googleServiceAccountData && appConfigData) {
    return {
      googleServiceAccountData,
      appConfigData
    };
  }

  try {
    googleServiceAccountData = JSON.parse(
      await readFile(join(__dirname, GOOGLE_SERVICE_ACCOUNT_FILE), 'utf8')
    );
    appConfigData = JSON.parse(
      await readFile(join(__dirname, APP_CONFIG_FILE), 'utf8')
    );
  } catch (error) {
    console.error('Error reading configuration files:', error);
    process.exit(1);
  }

  return {
    googleServiceAccountData,
    appConfigData
  };
}
