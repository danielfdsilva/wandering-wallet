function isEmptyCell(row) {
  if (row == null) return true;
  const cell = Array.isArray(row) ? row[0] : row;
  return cell === null || cell === undefined || String(cell).trim() === '';
}

// 1-based Sheet row. `columnCells` is A2:A… (header is row 1).
export function firstAvailableSheetRow(columnCells, startRow = 2) {
  const rows = columnCells || [];
  const gap = rows.findIndex(isEmptyCell);
  if (gap === -1) return startRow + rows.length;
  return startRow + gap;
}
