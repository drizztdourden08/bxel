/* @layer renderer-app @kind logic */
import type { LibrarySet, SwatchLibrary } from './swatch-library.type';

const findLibrarySet = (library: SwatchLibrary, key: string): LibrarySet | null =>
  library.groups.flatMap((group) => group.sets).find((set) => set.key === key) ?? null;

export { findLibrarySet };
