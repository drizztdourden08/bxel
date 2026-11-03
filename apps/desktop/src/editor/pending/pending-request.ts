/* @layer renderer-app @kind logic */
import type { TransactionMode, TransactionRequest } from '@bxel/document';
import { commitSteps } from '../commit-steps';
import type { EditorTarget } from '../editor.type';
import { PENDING_TEXT, PREVIEW_PIXELS } from './pending.constants';
import type { PendingEdit } from './pending.type';
import { pendingLabel } from './pending-label';
import { pendingScope } from './pending-scope';
import { pendingSteps } from './pending-steps';

const pendingRequest = (target: EditorTarget, pending: PendingEdit, mode: TransactionMode): TransactionRequest => {
  const label = pendingLabel(pending.spec);
  const named = pending.sprites.length > 1 ? PENDING_TEXT.onSprites(label, pending.sprites.length) : label;
  const request = commitSteps(target, named, pendingSteps(target, pending), pendingScope(target, pending));
  return mode === 'commit' ? request : { ...request, mode, previewPixels: PREVIEW_PIXELS };
};

export { pendingRequest };
