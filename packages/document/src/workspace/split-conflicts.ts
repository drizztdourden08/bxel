/* @layer core @kind logic */
import type { Placement, SplitConflict } from './split-plan.type';

const splitConflicts = (placements: readonly Placement[]): readonly SplitConflict[] => {
  const groups = new Map<string, Placement[]>();
  for (const placement of placements) {
    const name = `${placement.folder}/${placement.baseName}`.toLowerCase();
    groups.set(name, [...(groups.get(name) ?? []), placement]);
  }
  return [...groups.values()]
    .filter((group) => group.length > 1)
    .map((group) => ({
      folder: group[0]?.folder ?? '',
      fileName: group[0]?.baseName ?? '',
      names: group.map((placement) => placement.entry.name),
    }));
};

export { splitConflicts };
