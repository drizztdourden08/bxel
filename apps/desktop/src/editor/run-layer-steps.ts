/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTarget } from './current-target';
import type { EditorTarget } from './editor.type';
import { executeLayerSteps } from './execute-layer-steps';
import { layerErrorText } from './layer-error-text';

const runLayerSteps = (label: string, build: (target: EditorTarget) => readonly CommandStep[]): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const refused = executeLayerSteps(target, label, build(target));
  if (refused) useNoticeStore.getState().post(layerErrorText(refused, target.sprite));
  return refused === null;
};

export { runLayerSteps };
