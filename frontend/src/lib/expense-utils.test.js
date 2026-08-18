import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applySplit, localDateString } from './expense-utils.js';

test('applySplit uses the original amount, not a stacked result', () => {
  assert.equal(applySplit('30', '1/2'), '15.00');
  assert.equal(applySplit('30', '2/3'), '20.00');
});

test('applySplit returns empty string for invalid original amounts', () => {
  assert.equal(applySplit('', '1/2'), '');
  assert.equal(applySplit('nope', '1/2'), '');
});

test('localDateString uses local calendar date components', () => {
  const localEvening = new Date(2026, 7, 18, 23, 30, 0);
  assert.equal(localDateString(localEvening), '2026-08-18');
});
