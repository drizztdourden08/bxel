/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { useDocumentStore } from '../stores/useDocumentStore';
import { storeSymmetry } from './store-symmetry';

const saveSymmetry = (target: EditorTarget): boolean => {
  if (useDocumentStore.getState().host.view(target.documentId)?.state.readOnly) return false;
  const step = { name: COMMAND_NAME.spriteSymmetry, targets: spritesTarget([target.sprite.id]), options: storeSymmetry() };
  return runDocument('Mirror', [step]) !== null;
};

export { saveSymmetry };
