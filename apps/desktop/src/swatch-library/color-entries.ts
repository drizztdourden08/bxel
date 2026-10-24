/* @layer renderer-app @kind logic */
import type { SwatchSet } from '@bxel/project';
import type { ColorEntry } from './swatch-library.type';

const colorEntries = (set: SwatchSet | null): ColorEntry[] =>
  (set?.colors ?? []).map((color, at) => ({ id: `${set?.setId ?? ''}#${at}`, at, color }));

export { colorEntries };
