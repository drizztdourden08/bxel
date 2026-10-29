/* @layer renderer-app @kind logic */
import { relativeInside } from '@bxel/project';
import type { OpenProject } from '../project/project.type';
import type { IndexedFile } from '../workspace/link-index.type';
import { roleDirs } from '../workspace/role-dirs';
import { toSlashes } from '../workspace/to-slashes';
import type { MisplacedFinding } from './project-health.type';

const inside = (path: string, folder: string): boolean => relativeInside(toSlashes(folder), toSlashes(path)) !== undefined;

const misplacedFiles = (project: OpenProject, files: readonly IndexedFile[]): readonly MisplacedFinding[] =>
  files.flatMap((file): MisplacedFinding[] => {
    const home = project.folders.find((folder) => inside(file.path, folder.path));
    const stored = project.manifest.folders.find((folder) => folder.folderId === home?.folderId);
    if (!home || !stored) return [];
    const dirs = roleDirs(stored, home.path);
    const own = dirs[file.kind];
    const others = Object.entries(dirs).filter(([kind, dir]) => kind !== file.kind && dir !== own && dir !== toSlashes(home.path).replace(/\/+$/, ''));
    const strayed = own !== undefined && !inside(file.path, own) && others.some(([, dir]) => inside(file.path, dir));
    return strayed ? [{ fix: `place:${file.path}`, path: file.path, name: file.name, kind: file.kind, folder: own }] : [];
  });

export { misplacedFiles };
