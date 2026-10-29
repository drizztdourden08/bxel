/* @layer renderer-app @kind logic */
import type { SheetId, SpriteId } from '@bxel/document';
import { useEntryClipboardStore } from '../stores/useEntryClipboardStore';

const holdEntries = (ids: readonly SpriteId[], keys: readonly string[], sheetId: SheetId | null, cut: boolean): boolean => {
  if (sheetId === null || ids.length + keys.length === 0) return false;
  useEntryClipboardStore.getState().hold({ sheetId, ids, keys, cut });
  return true;
};

export { holdEntries };
