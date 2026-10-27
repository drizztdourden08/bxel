/* @layer electron-main @kind logic */
import { existsSync } from 'fs';
import { extname, isAbsolute, relative, resolve } from 'path';
import { assistantFolder } from './assistant-folder';
import type { AssistantMain } from './assistant.type';

const insideFolder = (folder: string, path: string): boolean => {
  const found = relative(resolve(folder), resolve(path));
  return found !== '' && !found.startsWith('..') && !isAbsolute(found);
};

const freeVariant = (path: string): string => {
  const stem = path.slice(0, path.length - extname(path).length);
  let candidate = path;
  for (let count = 2; existsSync(candidate); count += 1) candidate = `${stem} ${count}${extname(path)}`;
  return candidate;
};

const claimFiles = (state: AssistantMain, paths: readonly string[]): string[] => {
  const ctx = state.ctx;
  const folder = assistantFolder(state);
  return paths.map((path) => {
    if (!ctx || !insideFolder(folder, path)) return path;
    const free = freeVariant(path);
    ctx.documents.allow(free);
    return free;
  });
};

export { claimFiles };
