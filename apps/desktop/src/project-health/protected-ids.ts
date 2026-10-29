/* @layer renderer-app @kind logic */
import { comparablePath, joinInside } from '@bxel/project';
import type { OpenProject } from '../project/project.type';
import { organiseOf } from '../organise/organise-of';
import type { IndexedFile } from '../workspace/link-index.type';

const fileAt = (project: OpenProject, files: readonly IndexedFile[], place: { readonly folderId: string; readonly path: string } | undefined): readonly string[] => {
  const folder = place === undefined ? undefined : project.folders.find((each) => each.folderId === place.folderId);
  const joined = folder === undefined || place === undefined ? undefined : joinInside(folder.path, place.path);
  const wanted = joined?.ok ? comparablePath(joined.value) : undefined;
  return wanted === undefined ? [] : files.filter((file) => comparablePath(file.path) === wanted).map((file) => file.assetId);
};

const protectedIds = (project: OpenProject, files: readonly IndexedFile[]): ReadonlySet<string> => {
  const organise = organiseOf(project.manifest);
  const palette = project.manifest.defaults.palette;
  return new Set([
    ...organise.pinned,
    ...organise.collections.flatMap((each) => each.assets),
    ...fileAt(project, files, project.manifest.cover),
    ...fileAt(project, files, palette?.kind === 'file' ? palette : undefined),
  ]);
};

export { protectedIds };
