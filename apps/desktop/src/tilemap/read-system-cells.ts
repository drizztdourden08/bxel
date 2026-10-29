/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import type { CellClip } from '../stores/tilemap-store.type';
import { cellClipType } from './cell-clip-type';
import { decodeCellClip } from './decode-cell-clip';

const readSystemCells = async (): Promise<CellClip | null> => {
  try {
    const port = getPlatform().clipboard;
    if (!port) return null;
    const held = await port.read([cellClipType()]);
    const own = held[cellClipType()];
    return own instanceof Uint8Array ? decodeCellClip(own) : null;
  } catch {
    return null;
  }
};

export { readSystemCells };
