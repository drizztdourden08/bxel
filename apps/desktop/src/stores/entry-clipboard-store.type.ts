/* @layer renderer-app @kind types */
import type { SheetId, SpriteId } from '@bxel/document';

interface EntryClip {
  sheetId: SheetId;
  ids: readonly SpriteId[];
  keys: readonly string[];
  cut: boolean;
}

interface EntryClipboardState {
  clip: EntryClip | null;
  hold: (clip: EntryClip) => void;
  clear: () => void;
}

export type { EntryClip, EntryClipboardState };
