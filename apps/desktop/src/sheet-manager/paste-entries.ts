/* @layer renderer-app @kind logic */
import { useEntryClipboardStore } from '../stores/useEntryClipboardStore';
import { boundSheetId } from './bound-sheet';
import { copyToSheet } from './copy-to-sheet';
import { removeEntries } from './remove-entries';

const pasteEntries = (): boolean => {
  const { clip, clear } = useEntryClipboardStore.getState();
  const target = boundSheetId();
  if (!clip || target === null) return false;
  const added = copyToSheet(clip.ids, clip.keys, target);
  if (clip.cut && clip.sheetId !== target) {
    removeEntries(clip.ids, clip.keys, clip.sheetId);
    clear();
  }
  return added;
};

export { pasteEntries };
