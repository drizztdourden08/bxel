/* @layer renderer-app @kind logic */
import { toast, writeClipboard } from '@drizztdourden08/brock-react';
import type { PaletteTarget } from '../editor/editor.type';
import { hexListOf } from './hex-list-of';
import { PALETTE_EXPORT_TEXT } from './palette-export.constants';

const copyHexList = async (target: PaletteTarget, indices: readonly number[] | null): Promise<void> => {
  const text = hexListOf(target.bank, indices);
  if (text === '') {
    toast(PALETTE_EXPORT_TEXT.none, { variant: 'info' });
    return;
  }
  const copied = await writeClipboard(text);
  toast(copied ? PALETTE_EXPORT_TEXT.copied(text.split('\n').length) : PALETTE_EXPORT_TEXT.copyFailed, { variant: copied ? 'success' : 'danger' });
};

export { copyHexList };
