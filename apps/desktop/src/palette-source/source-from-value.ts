/* @layer renderer-app @kind logic */
import { findLibrarySet } from '../swatch-library/find-library-set';
import type { SwatchLibrary } from '../swatch-library/swatch-library.type';
import { CUSTOM_CHOICE, PRESET_PREFIX, SET_PREFIX } from './palette-source.constants';
import type { PaletteSource } from './palette-source.type';
import { sourceFromSet } from './source-from-set';

const setSource = (value: string, current: PaletteSource, library: SwatchLibrary): PaletteSource => {
  const found = findLibrarySet(library, value.slice(SET_PREFIX.length));
  return found ? sourceFromSet(found, current) : current;
};

const sourceFromValue = (value: string, current: PaletteSource, library: SwatchLibrary): PaletteSource | null => {
  if (value === CUSTOM_CHOICE) return { ...current, kind: 'custom' };
  if (value.startsWith(SET_PREFIX)) return setSource(value, current, library);
  if (!value.startsWith(PRESET_PREFIX)) return null;
  return { ...current, kind: 'preset', presetId: value.slice(PRESET_PREFIX.length) };
};

export { sourceFromValue };
