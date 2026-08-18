export function createAppConfigStore({ readFile, stat }) {
  let cache = null;

  return {
    async get(path) {
      const { mtimeMs } = await stat(path);
      if (cache && cache.path === path && cache.mtimeMs === mtimeMs) {
        return cache.data;
      }
      const data = JSON.parse(await readFile(path, 'utf8'));
      cache = { path, mtimeMs, data };
      return data;
    }
  };
}
