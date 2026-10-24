/* @layer renderer-app @kind logic */
import { CUSTOM_CHOICE, FILE_CHOICE, PRESET_PREFIX, SET_PREFIX } from './palette-source.constants';
import type { PaletteSource } from './palette-source.type';

const sourceValue = (source: PaletteSource): string => {
  if (source.kind === 'preset') return `${PRESET_PREFIX}${source.presetId}`;
  if (source.kind === 'set') return `${SET_PREFIX}${source.set?.key ?? ''}`;
  return source.kind === 'custom' ? CUSTOM_CHOICE : FILE_CHOICE;
};

export { sourceValue };
