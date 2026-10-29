/* @layer renderer-app @kind types */
import type { TransactionResult } from '@bxel/document';
import type { PathSession } from './editor.type';

type Committed = { readonly session: PathSession; readonly result: TransactionResult | null };

export type { Committed };
