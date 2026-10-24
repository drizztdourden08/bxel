/* @layer core @kind logic */
import type { Size } from '../../model/geometry.type';
import type { Sheet } from '../../model/sheet.type';
import { PLACEHOLDER_SPRITE_SIZE } from './placeholder.constants';

const placeholderSize = (sheet: Sheet, spriteId: string): Size => {
  const clipped = sheet.entries.find((entry) => entry.spriteId === spriteId && entry.source !== null)?.source;
  if (clipped) return { width: clipped.width, height: clipped.height };
  if (sheet.layout.kind === 'grid') return { width: sheet.layout.cellWidth, height: sheet.layout.cellHeight };
  return { width: PLACEHOLDER_SPRITE_SIZE, height: PLACEHOLDER_SPRITE_SIZE };
};

export { placeholderSize };
