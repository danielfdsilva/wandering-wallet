import { readFile, stat } from 'fs/promises';
import { repoRoot } from './load-env.js';
import {
  resolveConfigFilePath,
  resolveConfigPaths
} from './lib/config-env.js';
import { createAppConfigStore } from './lib/app-config-store.js';

let googleServiceAccountData = null;
const appConfigStore = createAppConfigStore({ readFile, stat });

export async function initConfig() {
  const { appConfig, serviceAccount } = resolveConfigPaths();

  if (!appConfig || !serviceAccount) {
    throw new Error(
      'Missing config paths. Set APP_CONFIG_FILE and GOOGLE_SERVICE_ACCOUNT_FILE.'
    );
  }

  const appConfigPath = resolveConfigFilePath(appConfig, repoRoot);
  const serviceAccountPath = resolveConfigFilePath(serviceAccount, repoRoot);

  if (!googleServiceAccountData) {
    try {
      googleServiceAccountData = JSON.parse(
        await readFile(serviceAccountPath, 'utf8')
      );
    } catch (error) {
      throw new Error(
        `Failed to read Google service account file: ${error.message}`
      );
    }
  }

  let appConfigData;
  try {
    appConfigData = await appConfigStore.get(appConfigPath);
  } catch (error) {
    throw new Error(`Failed to read app config file: ${error.message}`);
  }

  return {
    googleServiceAccountData,
    appConfigData
  };
}
