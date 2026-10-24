/* @layer core @kind logic */
import type { FolderId } from '../ids/id.type';
import type { ProjectFolder } from '../manifest/manifest.type';

const folderTargets = (
  folders: readonly Pick<ProjectFolder, 'folderId'>[],
  dirs: ReadonlyMap<FolderId, string>,
  base: string,
): ReadonlyMap<FolderId, string> => {
  const parent = base.replace(/\/$/, '');
  return new Map(folders.map((folder) => [folder.folderId, `${parent}/${dirs.get(folder.folderId) ?? ''}`]));
};

export { folderTargets };
