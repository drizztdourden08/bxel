/* @layer renderer-app @kind types */
import type { PendingEdit } from '../pending/pending.type';
import type { TransformSpec } from './transform.type';

interface ActiveTransform {
  pending: PendingEdit;
  spec: TransformSpec;
}

export type { ActiveTransform };
