/* @layer renderer-app @kind logic */
import { CHANNELS } from './tileset-overlay.constants';
import { DIGIT_ROWS, DIGIT_WIDTH, KEY_INK, KEY_SHADOW } from './key-digits.constants';

type Cell = { readonly width: number; readonly originX: number; readonly originY: number; readonly tileWidth: number; readonly tileHeight: number };

const plot = (data: Uint8ClampedArray, cell: Cell, at: { readonly x: number; readonly y: number }, colour: readonly number[]): void => {
  if (at.x < 0 || at.y < 0 || at.x >= cell.tileWidth || at.y >= cell.tileHeight) return;
  data.set(colour, ((cell.originY + at.y) * cell.width + cell.originX + at.x) * CHANNELS);
};

const drawTileKey = (data: Uint8ClampedArray, cell: Cell, key: number): void => {
  const digits = [...String(key)].map(Number);
  for (const [position, digit] of digits.entries()) {
    const rows = DIGIT_ROWS[digit] ?? [];
    const left = 1 + position * (DIGIT_WIDTH + 1);
    for (const shadow of [true, false]) {
      for (const [row, bits] of rows.entries()) {
        for (let column = 0; column < DIGIT_WIDTH; column += 1) {
          if ((bits >> (DIGIT_WIDTH - 1 - column)) % 2 === 0) continue;
          const at = { x: left + column + (shadow ? 1 : 0), y: 1 + row + (shadow ? 1 : 0) };
          plot(data, cell, at, shadow ? KEY_SHADOW : KEY_INK);
        }
      }
    }
  }
};

export { drawTileKey };
