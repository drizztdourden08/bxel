/* @layer renderer-app @kind logic */
import type { SourceGroup } from '../palette-source/palette-source.type';
import type { SetGroup } from './swatch-library.type';

const setSelectGroups = (groups: readonly SetGroup[]): SourceGroup[] =>
  groups.map((group) => ({
    label: group.label,
    options: group.sets.map((set) => ({ value: set.key, label: set.name })),
  }));

export { setSelectGroups };
