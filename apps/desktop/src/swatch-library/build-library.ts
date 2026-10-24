/* @layer renderer-app @kind logic */
import type { SwatchSet } from '@bxel/project';
import { builtinSets } from './builtin-sets';
import { librarySet } from './library-set';
import { ORIGIN_LABELS, ORIGIN_ORDER } from './swatch-library.constants';
import type { LibrarySet, SetGroup, SetOrigin, SwatchLibrary } from './swatch-library.type';

const groupOf = (origin: SetOrigin, sets: readonly LibrarySet[]): SetGroup[] =>
  sets.length === 0 ? [] : [{ origin, label: ORIGIN_LABELS[origin], sets }];

const buildLibrary = (user: readonly SwatchSet[], project: readonly SwatchSet[]): SwatchLibrary => {
  const lists: Readonly<Record<SetOrigin, readonly LibrarySet[]>> = {
    builtin: builtinSets(),
    user: user.map((set) => librarySet('user', set)),
    project: project.map((set) => librarySet('project', set)),
  };
  return { ...lists, groups: ORIGIN_ORDER.flatMap((origin) => groupOf(origin, lists[origin])) };
};

export { buildLibrary };
