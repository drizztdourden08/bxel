/* @layer renderer-app @kind logic */
import { relativeInside } from '@bxel/project';
import type { OpenProject } from '../project/project.type';
import type { IndexedFile } from '../workspace/link-index.type';
import { roleDirs } from '../workspace/role-dirs';
import { toSlashes } from '../workspace/to-slashes';
import type { MisplacedFinding } from './project-health.type';

const inside = (path: string, folder: string): boolean => relativeInside(toSlashes(folder), toSlashes(path)) !== undefined;

/**
 * A file is out of place when it sits in the folder of another kind (a sprite in the palettes folder) and not in its own.
 * Files in the root of a folder, or in a folder with no role, are left alone.
 */
const misplacedFiles = (project: OpenProject, files: readonly IndexedFile[]): readonly MisplacedFinding[] =>
  files.flatMap((file): MisplacedFinding[] => {
    const home = project.folders.find((folder) => inside(file.path, folder.path));
    const stored = project.manifest.folders.find((folder) => folder.folderId === home?.folderId);
    if (!home || !stored) return [];
    const dirs = roleDirs(stored, home.path);
    const own = dirs[file.kind];
    const others = Object.entries(dirs).filter(([kind, dir]) => kind !== file.kind && dir !== undefined && dir !== own && dir !== toSlashes(home.path).replace(/\/+$/, ''));
    const strayed = own !== undefined && !inside(file.path, own) && others.some(([, dir]) => dir !== undefined && inside(file.path, dir));
    return strayed ? [{ fix: `place:${file.path}`, path: file.path, name: file.name, kind: file.kind, folder: own }] : [];
  });

export { misplacedFiles };
