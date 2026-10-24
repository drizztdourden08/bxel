/* @layer renderer-app @kind logic */
import type { TransactionMode, TransactionRequest } from '@bxel/document';
import { commitRequest } from '../commit-request';
import type { EditorTarget } from '../editor.type';
import { PREVIEW_PIXELS } from './pending.constants';
import type { PendingEdit } from './pending.type';
import { pendingLabel } from './pending-label';
import { pendingScope } from './pending-scope';
import { pendingStep } from './pending-step';

const pendingRequest = (target: EditorTarget, pending: PendingEdit, mode: TransactionMode): TransactionRequest => {
  const request = commitRequest(target, pendingLabel(pending.spec), pendingStep(target, pending), pendingScope(target, pending));
  return mode === 'commit' ? request : { ...request, mode, previewPixels: PREVIEW_PIXELS };
};

export { pendingRequest };
