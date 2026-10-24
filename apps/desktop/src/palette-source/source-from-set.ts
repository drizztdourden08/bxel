/* @layer renderer-app @kind logic */
import type { LibrarySet } from '../swatch-library/swatch-library.type';
import type { PaletteSource } from './palette-source.type';

const sourceFromSet = (set: LibrarySet, current: PaletteSource): PaletteSource => ({
  ...current,
  kind: 'set',
  set: { key: set.key, name: set.name, colors: set.colors },
});

export { sourceFromSet };
