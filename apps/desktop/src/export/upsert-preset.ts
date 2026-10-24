/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import type { SavedPreset } from './export.type';

const upsertPreset = (presets: readonly SavedPreset[], preset: SavedPreset): SavedPreset[] => {
  const key = nameKey(preset.name);
  const exists = presets.some((each) => nameKey(each.name) === key);
  return exists ? presets.map((each) => (nameKey(each.name) === key ? preset : each)) : [...presets, preset];
};

export { upsertPreset };
