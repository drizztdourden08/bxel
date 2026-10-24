/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import type { SavedPreset } from './export.type';
import { PRESET_TEXT } from './preset-list.constants';
import type { PresetEdit } from './preset-list.type';

const renamePreset = (presets: readonly SavedPreset[], from: string, to: string): PresetEdit => {
  const next = to.trim();
  if (next === '') return { ok: false, message: PRESET_TEXT.nameEmpty };
  const clash = presets.some((preset) => nameKey(preset.name) === nameKey(next) && nameKey(preset.name) !== nameKey(from));
  if (clash) return { ok: false, message: PRESET_TEXT.nameTaken(next) };
  return { ok: true, presets: presets.map((preset) => (nameKey(preset.name) === nameKey(from) ? { ...preset, name: next } : preset)) };
};

export { renamePreset };
