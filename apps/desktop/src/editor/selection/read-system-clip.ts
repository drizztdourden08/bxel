/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { CLIPBOARD_PNG } from '@drizztdourden08/brock-core/platform';
import { bankTable } from '../bank-table';
import type { EditorTarget } from '../editor.type';
import { clipFromPng } from './clip-from-png';
import { clipType } from './clip-type';
import { decodeClip } from './decode-clip';
import { remapClip } from './remap-clip';
import type { SystemClip } from './system-clip.type';

const readSystemClip = async (target: EditorTarget): Promise<SystemClip | null> => {
  try {
    const port = getPlatform().clipboard;
    if (!port) return null;
    const held = await port.read([clipType(), CLIPBOARD_PNG]);
    const table = Uint8Array.from(bankTable(target.bank));
    const own = held[clipType()];
    const carried = own instanceof Uint8Array ? decodeClip(own) : null;
    if (carried) return remapClip(carried.clip, carried.table, table);
    const png = held[CLIPBOARD_PNG];
    return png instanceof Uint8Array ? clipFromPng(png, table) : null;
  } catch {
    return null;
  }
};

export { readSystemClip };
