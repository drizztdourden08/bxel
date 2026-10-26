/* @layer renderer-app @kind logic */
import type { CSSProperties } from 'react';
import { HEADER_ROWS, ROW_INDEX_PROPERTY } from '../SpritesPanel.constants';
import type { RowPlace } from '../SpritesPanel.type';

const rowPlace = (at: number): RowPlace => ({
  style: { [ROW_INDEX_PROPERTY]: at } as CSSProperties,
  'aria-rowindex': at + HEADER_ROWS + 1,
  'data-row-index': at,
});

export { rowPlace };
