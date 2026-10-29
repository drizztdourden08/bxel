/* @layer renderer-app @kind logic */
import type { Tilemap } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';

const selectionMaskOf = (selection: MapSelection | null, tilemap: Tilemap): Uint8Array => {
  const out = new Uint8Array(tilemap.columns * tilemap.rows);
  if (!selection) return out;
  const { rect, mask } = selection;
  for (let row = 0; row < rect.height; row += 1) {
    const y = rect.y + row;
    if (y < 0 || y >= tilemap.rows) continue;
    for (let column = 0; column < rect.width; column += 1) {
      const x = rect.x + column;
      if (x >= 0 && x < tilemap.columns && (mask === null || mask[row * rect.width + column] === 1)) out[y * tilemap.columns + x] = 1;
    }
  }
  return out;
};

export { selectionMaskOf };
