/* @layer renderer-app @kind logic */
import { CUSTOM_CHOICE, PRESET_PREFIX } from './palette-source.constants';
import type { PaletteSource } from './palette-source.type';

const sourceFromValue = (value: string, current: PaletteSource): PaletteSource | null => {
  if (value === CUSTOM_CHOICE) return { ...current, kind: 'custom' };
  if (!value.startsWith(PRESET_PREFIX)) return null;
  return { ...current, kind: 'preset', presetId: value.slice(PRESET_PREFIX.length) };
};

export { sourceFromValue };
