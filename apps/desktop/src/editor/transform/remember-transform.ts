/* @layer renderer-app @kind logic */
import { useTransformUiStore } from '../../stores/useTransformUiStore';
import { newestTag } from '../selection/newest-tag';
import type { PendingEdit } from '../pending/pending.type';

const rememberTransform = (pending: PendingEdit): void => {
  if (pending.spec.kind === 'transform') useTransformUiStore.getState().setLast({ documentId: pending.documentId, tag: newestTag(pending.documentId), spec: pending.spec });
};

export { rememberTransform };
