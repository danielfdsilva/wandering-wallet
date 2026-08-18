export function validateExpense(body = {}) {
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Amount must be positive' };
  }

  const category = typeof body.category === 'string' ? body.category.trim() : '';
  if (!category) {
    return { ok: false, error: 'Category is required' };
  }

  const date = typeof body.date === 'string' ? body.date.trim() : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return { ok: false, error: 'Date is invalid' };
  }

  return {
    ok: true,
    value: {
      amount,
      category,
      date,
      currency:
        typeof body.currency === 'string' ? body.currency.toLowerCase() : '',
      description:
        typeof body.description === 'string' ? body.description : '',
      participants: body.participants
    }
  };
}
