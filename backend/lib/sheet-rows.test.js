import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstAvailableSheetRow } from './sheet-rows.js';

test('uses row 2 when there is no data yet', () => {
  assert.equal(firstAvailableSheetRow([]), 2);
  assert.equal(firstAvailableSheetRow(null), 2);
});

test('uses the first empty gap after existing rows', () => {
  assert.equal(
    firstAvailableSheetRow([['a'], ['b'], [''], ['c']]),
    4
  );
  assert.equal(firstAvailableSheetRow([['a'], [], ['c']]), 3);
});

test('appends after the last filled row when there are no gaps', () => {
  assert.equal(firstAvailableSheetRow([['a'], ['b']]), 4);
});
