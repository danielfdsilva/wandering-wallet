import { readFile, stat } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, isAbsolute, join } from 'path';
import dotenv from 'dotenv';
import { resolveConfigPaths } from './lib/config-env.js';
import { createAppConfigStore } from './lib/app-config-store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let googleServiceAccountData = null;
const appConfigStore = createAppConfigStore({ readFile, stat });

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

  if (!googleServiceAccountData) {
    try {
      googleServiceAccountData = JSON.parse(
        await readFile(resolveFromBackend(serviceAccount), 'utf8')
      );
    } catch (error) {
      console.error('Error reading configuration files:', error);
      process.exit(1);
    }
  }

  try {
    const appConfigData = await appConfigStore.get(resolveFromBackend(appConfig));
    return {
      googleServiceAccountData,
      appConfigData
    };
  } catch (error) {
    console.error('Error reading configuration files:', error);
    process.exit(1);
  }
}
