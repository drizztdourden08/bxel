/* @layer renderer-app @kind logic */
import type { CellClip } from '../stores/tilemap-store.type';
import { CELL_CLIP_VERSION } from './cell-clip.constants';

const encodeCellClip = (clip: CellClip): Uint8Array =>
  new TextEncoder().encode(
    JSON.stringify({
      v: CELL_CLIP_VERSION,
      tileset: clip.tilesetId,
      columns: clip.stamp.columns,
      rows: clip.stamp.rows,
      x: clip.origin.x,
      y: clip.origin.y,
      keys: clip.stamp.keys,
      ...(clip.stamp.bits ? { bits: clip.stamp.bits } : {}),
    }),
  );

export { encodeCellClip };
