/* @layer renderer-app @kind types */
import type { EditorTarget } from '../editor.type';
import type { PendingEdit } from './pending.type';

type Built = { readonly target: EditorTarget; readonly pending: PendingEdit; readonly blocked: string | null };

export type { Built };
