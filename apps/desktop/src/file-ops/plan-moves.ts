/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { Relocation } from './file-ops.type';
import { planMovesIn } from './plan-moves-in';

const planMoves = async (paths: readonly string[], toFolder: string): Promise<readonly Relocation[] | string> => {
  const kit = fileKit();
  return kit ? planMovesIn(kit.documents, paths, toFolder) : FILE_OPS_TEXT.unavailable;
};

export { planMoves };
