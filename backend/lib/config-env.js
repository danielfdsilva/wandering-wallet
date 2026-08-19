import { isAbsolute, join } from 'path';

export function resolveConfigPaths(env = process.env) {
  return {
    appConfig: env.APP_CONFIG_FILE,
    serviceAccount: env.GOOGLE_SERVICE_ACCOUNT_FILE
  };
}

export function resolveConfigFilePath(filePath, repoRoot) {
  if (!filePath) return filePath;
  return isAbsolute(filePath) ? filePath : join(repoRoot, filePath);
}
