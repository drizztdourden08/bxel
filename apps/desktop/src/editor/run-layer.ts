/* @layer renderer-app @kind logic */
import type { TransactionOk } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { commitRequest } from './commit-request';
import type { CommitStep } from './commit-request.type';
import type { EditorTarget } from './editor.type';
import { layerErrorText } from './layer-error-text';
import { spriteScope } from './sprite-scope';

const runLayer = (target: EditorTarget, label: string, step: CommitStep): TransactionOk | null => {
  const result = useDocumentStore.getState().host.execute(commitRequest(target, label, step, spriteScope(target)));
  if (result.ok) return result;
  useNoticeStore.getState().post(layerErrorText(result.error, target.sprite));
  return null;
};

export { runLayer };
