/* @layer renderer-app @kind logic */
import type { ProjectOrganise } from '@bxel/project';
import { presentAssetIds } from './present-asset-ids';
import type { FileEntry } from './project-browser.type';

const tagCounts = (organise: ProjectOrganise, files: readonly FileEntry[]): ReadonlyMap<string, number> => {
  const present = presentAssetIds(files);
  const counts = new Map<string, number>();
  for (const [id, tags] of Object.entries(organise.tags)) {
    if (present.has(id)) for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return counts;
};

export { tagCounts };
