export function resolveConfigPaths(env = process.env) {
  return {
    appConfig: env.APP_CONFIG_FILE || env.APP_CONFIG_PATH,
    serviceAccount: env.GOOGLE_SERVICE_ACCOUNT_FILE || env.GOOGLE_SERVICE_ACCOUNT_JSON
  };
}
