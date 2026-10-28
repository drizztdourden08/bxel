/* @layer renderer-app @kind logic */
import { celUses } from '@bxel/document';
import type { EditorTarget } from './editor.type';

const isLinkedCel = (target: EditorTarget): boolean => {
  const celId = target.layer.cels[target.frameId];
  return celId !== undefined && celUses(target.sprite, celId).length > 1;
};

export { isLinkedCel };
