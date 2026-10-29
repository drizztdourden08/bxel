/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { Relocation } from './file-ops.type';
import { planRenameIn } from './plan-rename-in';

const planRename = async (path: string, typed: string, isFolder: boolean): Promise<Relocation | string | null> => {
  const kit = fileKit();
  return kit ? planRenameIn(kit.documents, path, typed, isFolder) : FILE_OPS_TEXT.unavailable;
};

export { planRename };
