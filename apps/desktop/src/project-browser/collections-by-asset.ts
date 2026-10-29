/* @layer renderer-app @kind logic */
import type { ProjectOrganise } from '@bxel/project';

const collectionsByAsset = (organise: ProjectOrganise): ReadonlyMap<string, readonly string[]> => {
  const found = new Map<string, string[]>();
  for (const collection of organise.collections) {
    for (const id of collection.assets) found.set(id, [...(found.get(id) ?? []), collection.name]);
  }
  return found;
};

export { collectionsByAsset };
