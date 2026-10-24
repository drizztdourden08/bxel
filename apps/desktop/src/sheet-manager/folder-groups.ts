/* @layer renderer-app @kind logic */
import { folderPath } from './folder-path';
import type { FolderGroup } from './folders.type';
import { NAME_COLLATOR } from './manager.constants';
import type { SpriteFacts } from './manager.type';
import { pathChain } from './path-chain';

const folderGroups = (shown: readonly SpriteFacts[], collapsed: ReadonlySet<string>): FolderGroup[] => {
  const byPath = new Map<string, SpriteFacts[]>();
  for (const fact of shown) {
    const path = folderPath(fact.sprite.name);
    byPath.set(path, [...(byPath.get(path) ?? []), fact]);
  }
  return [...byPath.keys()]
    .sort((a, b) => NAME_COLLATOR.compare(a, b))
    .map((path) => {
      const chain = path === '' ? [] : pathChain(path);
      return {
        path,
        depth: chain.length,
        facts: byPath.get(path) ?? [],
        closed: collapsed.has(path),
        hidden: chain.slice(0, -1).some((each) => collapsed.has(each)),
      };
    });
};

export { folderGroups };
