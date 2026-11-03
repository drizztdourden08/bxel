/* @layer renderer-app @kind logic */
import type { CommitStep } from '../commit-request.type';
import type { EditorTarget } from '../editor.type';
import { mirrorSiblings } from '../transform/mirror-siblings';
import type { PendingEdit } from './pending.type';
import { pendingStep } from './pending-step';

const pendingSteps = (target: EditorTarget, pending: PendingEdit): CommitStep[] => [
  pendingStep(target, pending),
  ...mirrorSiblings(target, pending).map((sibling) => pendingStep(target, sibling)),
];

export { pendingSteps };
