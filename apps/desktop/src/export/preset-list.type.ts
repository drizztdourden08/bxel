/* @layer renderer-app @kind types */
import type { SavedPreset } from './export.type';

type PresetEdit = { readonly ok: true; readonly presets: readonly SavedPreset[] } | { readonly ok: false; readonly message: string };

export type { PresetEdit };
