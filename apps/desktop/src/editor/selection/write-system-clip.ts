/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { CLIPBOARD_PNG } from '@drizztdourden08/brock-core/platform';
import { bankTable } from '../bank-table';
import type { EditorTarget } from '../editor.type';
import { clipPng } from './clip-png';
import { clipType } from './clip-type';
import { encodeClip } from './encode-clip';
import type { Clip } from './selection.type';

const writeSystemClip = async (clip: Clip, target: EditorTarget): Promise<boolean> => {
  try {
    const table = Uint8Array.from(bankTable(target.bank));
    const port = getPlatform().clipboard;
    const png = clipPng(clip, table);
    if (!port) return false;
    await port.write({ [clipType()]: encodeClip(clip, table), ...(png ? { [CLIPBOARD_PNG]: png } : {}) });
    return true;
  } catch {
    return false;
  }
};

export { writeSystemClip };
