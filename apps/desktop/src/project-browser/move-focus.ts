/* @layer renderer-app @kind logic */
import { verticalTarget } from './vertical-target';
import { NO_MOVE as NONE } from './project-browser.constants';
import type { FocusMove, VisibleRow } from './project-browser.type';

const onRight = (rows: readonly VisibleRow[], index: number): FocusMove => {
  const row = rows[index];
  if (row === undefined || row.expanded === null) return NONE;
  if (!row.expanded) return { kind: 'expand', key: row.item.key };
  const next = rows[index + 1];
  return next !== undefined && next.depth > row.depth ? { kind: 'focus', key: next.item.key } : NONE;
};

const onLeft = (rows: readonly VisibleRow[], index: number): FocusMove => {
  const row = rows[index];
  if (row === undefined) return NONE;
  if (row.expanded === true) return { kind: 'collapse', key: row.item.key };
  for (let at = index - 1; at >= 0; at -= 1) {
    const above = rows[at];
    if (above !== undefined && above.depth < row.depth) return { kind: 'focus', key: above.item.key };
  }
  return NONE;
};

const moveFocus = (rows: readonly VisibleRow[], key: string, press: string): FocusMove => {
  const index = rows.findIndex((row) => row.item.key === key);
  if (index < 0) return NONE;
  if (press === 'ArrowRight') return onRight(rows, index);
  if (press === 'ArrowLeft') return onLeft(rows, index);
  const target = verticalTarget(press, index, rows.length);
  const row = target === null ? undefined : rows[target];
  return row === undefined ? NONE : { kind: 'focus', key: row.item.key };
};

export { moveFocus };
