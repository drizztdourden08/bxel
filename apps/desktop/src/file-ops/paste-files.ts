/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useFileClipboardStore } from '../stores/useFileClipboardStore';
import { copyEntries } from './copy-entries';
import { FILE_OPS_TEXT } from './file-ops.constants';
import { moveEntries } from './move-entries';

const pasteFiles = async (toFolder: string): Promise<boolean> => {
  const { clip, clear } = useFileClipboardStore.getState();
  if (clip === null) {
    toast(FILE_OPS_TEXT.nothingHeld, { variant: 'warning' });
    return false;
  }
  const outcome = clip.cut ? await moveEntries(clip.paths, toFolder) : await copyEntries(clip.paths, toFolder);
  if (outcome.ok && clip.cut) clear();
  return outcome.ok;
};

export { pasteFiles };
