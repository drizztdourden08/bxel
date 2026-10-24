/* @layer renderer-app @kind types */
import type { CommandStep } from '@bxel/document';

type DuplicatePlan = { readonly name: string; readonly steps: readonly CommandStep[] };

export type { DuplicatePlan };
