/* @layer renderer-app @kind logic */
import { CHANNELS } from './tileset-overlay.constants';
import { DIGIT_ROWS, DIGIT_WIDTH, KEY_INK, KEY_SHADOW } from './key-digits.constants';
import type { Cell, GlyphPlace } from './draw-tile-key.type';

const plot = (data: Uint8ClampedArray, cell: Cell, at: { readonly x: number; readonly y: number }, colour: readonly number[]): void => {
  if (at.x < 0 || at.y < 0 || at.x >= cell.tileWidth || at.y >= cell.tileHeight) return;
  data.set(colour, ((cell.originY + at.y) * cell.width + cell.originX + at.x) * CHANNELS);
};

const drawGlyph = (data: Uint8ClampedArray, cell: Cell, rows: readonly number[], place: GlyphPlace): void => {
  const offset = place.shadow ? 1 : 0;
  for (const [row, bits] of rows.entries()) {
    for (let column = 0; column < DIGIT_WIDTH; column += 1) {
      if ((bits >> (DIGIT_WIDTH - 1 - column)) % 2 === 0) continue;
      plot(data, cell, { x: place.left + column + offset, y: 1 + row + offset }, place.shadow ? KEY_SHADOW : KEY_INK);
    }
  }
};

const drawTileKey = (data: Uint8ClampedArray, cell: Cell, key: number): void => {
  const digits = [...String(key)].map(Number);
  for (const [position, digit] of digits.entries()) {
    const rows = DIGIT_ROWS[digit] ?? [];
    const left = 1 + position * (DIGIT_WIDTH + 1);
    for (const shadow of [true, false]) drawGlyph(data, cell, rows, { left, shadow });
  }
};

export { drawTileKey };
