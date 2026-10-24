/* @layer renderer-app @kind logic */
import type { QuitDecision } from '@drizztdourden08/brock-core';
import { decideQuit } from './decide-quit';
import { liveQuitDeps } from './live-quit-deps';

const closeGuard = (): Promise<QuitDecision> => decideQuit(liveQuitDeps);

export { closeGuard };
