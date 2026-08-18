import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveConfigPaths } from './config-env.js';

test('prefers APP_CONFIG_FILE and GOOGLE_SERVICE_ACCOUNT_FILE', () => {
  const paths = resolveConfigPaths({
    APP_CONFIG_FILE: './a.json',
    APP_CONFIG_PATH: './b.json',
    GOOGLE_SERVICE_ACCOUNT_FILE: './sa.json',
    GOOGLE_SERVICE_ACCOUNT_JSON: './other.json'
  });
  assert.equal(paths.appConfig, './a.json');
  assert.equal(paths.serviceAccount, './sa.json');
});

test('falls back to README/docker alias names', () => {
  const paths = resolveConfigPaths({
    APP_CONFIG_PATH: './b.json',
    GOOGLE_SERVICE_ACCOUNT_JSON: './sa.json'
  });
  assert.equal(paths.appConfig, './b.json');
  assert.equal(paths.serviceAccount, './sa.json');
});
