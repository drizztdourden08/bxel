/* @layer renderer-app @kind logic */
import { isSamePath, relativeInside } from '@bxel/project';
import type { FolderCover } from '../assistant.type';

const insideCover = (cover: FolderCover, path: string | undefined): boolean =>
  path !== undefined && (cover.folders.some((folder) => relativeInside(folder, path) !== undefined) || cover.projectFiles.some((file) => isSamePath(file, path)));

export { insideCover };
