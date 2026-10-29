/* @layer renderer-app @kind logic */
import type { ProjectOrganise } from '@bxel/project';
import { presentAssetIds } from './present-asset-ids';
import { BROWSER_TEXT } from './project-browser.constants';
import type { FileEntry, FolderNode } from './project-browser.type';

const collectionTree = (organise: ProjectOrganise, files: readonly FileEntry[]): FolderNode => {
  const present = presentAssetIds(files);
  return {
    key: 'collections',
    label: BROWSER_TEXT.collections,
    children: [],
    items: organise.collections.map((each) => ({ key: each.id, label: each.name, icon: 'bookmark', count: each.assets.filter((id) => present.has(id)).length })),
  };
};

export { collectionTree };
