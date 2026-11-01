/* @layer renderer-app @kind logic */
import type { TargetScope, TransactionRequest } from '@bxel/document';
import type { CommitStep } from './commit-request.type';
import { commitSteps } from './commit-steps';
import type { EditorTarget } from './editor.type';

const commitRequest = (target: EditorTarget, label: string, step: CommitStep, scope?: TargetScope): TransactionRequest => commitSteps(target, label, [step], scope);

export { commitRequest };
