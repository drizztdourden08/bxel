/* @layer core @kind logic */
import { checkRelPath } from '../paths/check-rel-path';
import type { DocumentFolder } from '../project-document/project-document.type';
import type { Verdict } from './judge-file.type';
import { isNativeAsset } from './is-native-asset';
import { isUnderRole } from './is-under-role';

const judgeFile = (folder: DocumentFolder | undefined, path: string): Verdict => {
  if (!isNativeAsset(path)) return { kind: 'ignore' };
  if (folder === undefined) return { kind: 'skip', reason: 'The folder is not in the project.' };
  if (!checkRelPath(path).ok) return { kind: 'skip', reason: 'The path breaks the path rules.' };
  return isUnderRole(folder, 'exports', path) ? { kind: 'ignore' } : { kind: 'add' };
};

export { judgeFile };
