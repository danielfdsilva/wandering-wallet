import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAppConfigStore } from './app-config-store.js';

test('reloads app config when the file mtime changes', async () => {
  const files = {
    '/tmp/app-config.json': {
      mtimeMs: 1,
      contents: JSON.stringify({ participants: [{ email: 'old@test.com' }] })
    }
  };

  const store = createAppConfigStore({
    readFile: async (path) => files[path].contents,
    stat: async (path) => ({ mtimeMs: files[path].mtimeMs })
  });

  const first = await store.get('/tmp/app-config.json');
  assert.equal(first.participants[0].email, 'old@test.com');

  files['/tmp/app-config.json'] = {
    mtimeMs: 2,
    contents: JSON.stringify({ participants: [{ email: 'new@test.com' }] })
  };

  const second = await store.get('/tmp/app-config.json');
  assert.equal(second.participants[0].email, 'new@test.com');
});

test('returns cached app config when mtime is unchanged', async () => {
  let reads = 0;
  const store = createAppConfigStore({
    readFile: async () => {
      reads += 1;
      return JSON.stringify({ participants: [] });
    },
    stat: async () => ({ mtimeMs: 10 })
  });

  await store.get('/tmp/app-config.json');
  await store.get('/tmp/app-config.json');
  assert.equal(reads, 1);
});
