/* @layer core @kind logic */
import { FILE_EXTENSIONS } from './path.constants';
import type { FileKind } from './path.type';

const hasExtension = (name: string, kind: FileKind): boolean => {
  const dot = name.lastIndexOf('.');
  if (dot < 1) return false;
  const allowed: readonly string[] = FILE_EXTENSIONS[kind];
  return allowed.includes(name.slice(dot + 1));
};

export { hasExtension };
