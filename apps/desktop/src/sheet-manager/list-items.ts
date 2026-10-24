/* @layer renderer-app @kind logic */
import type { FolderGroup, ListItem } from './folders.type';

const listItems = (groups: readonly FolderGroup[]): ListItem[] =>
  groups
    .filter((group) => !group.hidden)
    .flatMap((group) => {
      const head: ListItem[] = group.path === '' ? [] : [{ key: `folder:${group.path}`, group, fact: null }];
      const rows: ListItem[] = group.closed ? [] : group.facts.map((fact) => ({ key: fact.sprite.id, group: null, fact }));
      return [...head, ...rows];
    });

export { listItems };
