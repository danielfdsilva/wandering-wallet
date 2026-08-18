import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateExpense } from './validate-expense.js';

test('rejects missing or non-numeric amount', () => {
  assert.equal(validateExpense({ category: 'X', date: '2026-08-18' }).ok, false);
  assert.equal(
    validateExpense({ amount: 'banana', category: 'X', date: '2026-08-18' }).ok,
    false
  );
});

test('rejects zero and negative amounts', () => {
  assert.equal(
    validateExpense({ amount: 0, category: 'X', date: '2026-08-18' }).ok,
    false
  );
  assert.equal(
    validateExpense({ amount: -5, category: 'X', date: '2026-08-18' }).ok,
    false
  );
});

test('rejects empty category', () => {
  assert.equal(
    validateExpense({ amount: 10, category: '', date: '2026-08-18' }).ok,
    false
  );
});

test('rejects invalid date', () => {
  assert.equal(
    validateExpense({ amount: 10, category: 'X', date: 'lol' }).ok,
    false
  );
});

test('accepts a valid expense and keeps the amount numeric', () => {
  const result = validateExpense({
    amount: 12.5,
    category: 'Refeições',
    date: '2026-08-18',
    currency: 'eur',
    description: 'almoço',
    participants: 'Ambos'
  });
  assert.equal(result.ok, true);
  assert.equal(result.value.amount, 12.5);
  assert.equal(result.value.category, 'Refeições');
});
