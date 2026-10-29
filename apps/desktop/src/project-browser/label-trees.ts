/* @layer renderer-app @kind logic */
import type { ProjectOrganise } from '@bxel/project';
import { BROWSER_TEXT } from './project-browser.constants';
import type { FileEntry, FolderNode } from './project-browser.type';

const quoted = (text: string): string => (/\s/.test(text) ? `"${text}"` : text);

const collectionQuery = (name: string): string => `collection:${quoted(name)}`;

const tagQuery = (tag: string): string => `tag:${quoted(tag)}`;

const collectionTree = (organise: ProjectOrganise, files: readonly FileEntry[]): FolderNode => {
  const present = new Set(files.flatMap((entry) => (entry.row.assetId === null ? [] : [entry.row.assetId])));
  return {
    key: 'collections',
    label: BROWSER_TEXT.collections,
    children: [],
    items: organise.collections.map((each) => ({ key: each.id, label: each.name, icon: 'bookmark', count: each.assets.filter((id) => present.has(id)).length })),
  };
};

const tagCounts = (organise: ProjectOrganise, files: readonly FileEntry[]): ReadonlyMap<string, number> => {
  const present = new Set(files.flatMap((entry) => (entry.row.assetId === null ? [] : [entry.row.assetId])));
  const counts = new Map<string, number>();
  for (const [id, tags] of Object.entries(organise.tags)) {
    if (present.has(id)) for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return counts;
};

const tagTree = (counts: ReadonlyMap<string, number>): FolderNode => ({
  key: 'tags',
  label: BROWSER_TEXT.tags,
  children: [],
  items: [...counts].sort(([left], [right]) => left.localeCompare(right)).map(([tag, count]) => ({ key: tag, label: tag, icon: 'tag', count })),
});

export { collectionQuery, collectionTree, tagCounts, tagQuery, tagTree };
