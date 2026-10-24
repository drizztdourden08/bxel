/* @layer renderer-app @kind types */
import type { PendingSpec } from './pending.type';

type SpecOf<K extends PendingSpec['kind']> = Extract<PendingSpec, { kind: K }>;

export type { SpecOf };
