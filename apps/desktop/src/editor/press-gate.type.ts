/* @layer renderer-app @kind types */
import type { EditorTarget } from './editor.type';
import type { PressPlan } from './press-plan.type';

type Gate = { readonly target: EditorTarget; readonly plan: Exclude<PressPlan, { kind: 'zoom' }> };

export type { Gate };
