/* @layer renderer-app @kind logic */
import type { FolderGroup, GridRow } from './folders.type';

const gridRows = (groups: readonly FolderGroup[], columns: number): GridRow[] =>
  groups
    .filter((group) => !group.hidden)
    .flatMap((group) => {
      const head: GridRow[] = group.path === '' ? [] : [{ key: `folder:${group.path}`, group, facts: [] }];
      const count = group.closed ? 0 : Math.ceil(group.facts.length / columns);
      const rows = Array.from({ length: count }, (_unused, row) => {
        const facts = group.facts.slice(row * columns, (row + 1) * columns);
        return { key: `${group.path}:${facts[0]?.sprite.id ?? row}`, group: null, facts };
      });
      return [...head, ...rows];
    });

export { gridRows };
