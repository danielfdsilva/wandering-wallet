import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, isAbsolute, join } from 'path';
import dotenv from 'dotenv';
import { resolveConfigPaths } from './lib/config-env.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let googleServiceAccountData = null;
let appConfigData = null;

function resolveFromBackend(filePath) {
  return isAbsolute(filePath) ? filePath : join(__dirname, filePath);
}

export async function initConfig() {
  const { appConfig, serviceAccount } = resolveConfigPaths();

  if (!appConfig || !serviceAccount) {
    throw new Error(
      'Missing config paths. Set APP_CONFIG_FILE (or APP_CONFIG_PATH) and GOOGLE_SERVICE_ACCOUNT_FILE (or GOOGLE_SERVICE_ACCOUNT_JSON).'
    );
  }

  if (googleServiceAccountData && appConfigData) {
    return {
      googleServiceAccountData,
      appConfigData
    };
  }

  try {
    googleServiceAccountData = JSON.parse(
      await readFile(resolveFromBackend(serviceAccount), 'utf8')
    );
    appConfigData = JSON.parse(
      await readFile(resolveFromBackend(appConfig), 'utf8')
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
