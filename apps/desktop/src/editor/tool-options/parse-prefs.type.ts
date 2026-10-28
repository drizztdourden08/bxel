/* @layer renderer-app @kind types */
import type { ToolPrefs } from '../../stores/tool-prefs-store.type';

interface StoredPrefs extends ToolPrefs {
  shareBrush: boolean;
}

export type { StoredPrefs };
