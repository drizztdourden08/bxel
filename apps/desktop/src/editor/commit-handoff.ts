/* @layer renderer-app @kind logic */
import type { HandoffSlot } from './commit-handoff.type';

const commitHandoff: HandoffSlot = { current: null };

export { commitHandoff };
