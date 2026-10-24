/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import type { SavedPreset } from './export.type';

const removePreset = (presets: readonly SavedPreset[], name: string): readonly SavedPreset[] => presets.filter((preset) => nameKey(preset.name) !== nameKey(name));

export { removePreset };
