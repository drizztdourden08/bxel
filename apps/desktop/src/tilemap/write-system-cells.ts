/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import type { CellClip } from '../stores/tilemap-store.type';
import { cellClipType } from './cell-clip-type';
import { encodeCellClip } from './encode-cell-clip';

const writeSystemCells = async (clip: CellClip): Promise<boolean> => {
  try {
    const port = getPlatform().clipboard;
    if (!port) return false;
    await port.write({ [cellClipType()]: encodeCellClip(clip) });
    return true;
  } catch {
    return false;
  }
};

export { writeSystemCells };
