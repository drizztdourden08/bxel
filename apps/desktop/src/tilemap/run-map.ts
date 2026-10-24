/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { runDocument } from '../sheet/run-document';

const runMap = (label: string, steps: readonly CommandStep[]): boolean => steps.length > 0 && runDocument(label, steps) !== null;

export { runMap };
