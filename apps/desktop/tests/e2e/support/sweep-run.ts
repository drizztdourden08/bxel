/* @layer renderer-app @kind logic */
import { findRunProcesses } from './find-run-processes';
import { killTree } from './kill-tree';
import { sleepSync } from './sleep-sync';

const POLL_STEP_MS = 500;

const sweepRun = (runId: string, graceMs: number): readonly string[] => {
  const deadline = Date.now() + graceMs;
  let found = findRunProcesses(runId);
  while (found.length > 0 && Date.now() < deadline) {
    sleepSync(POLL_STEP_MS);
    found = findRunProcesses(runId);
  }
  for (const each of found) killTree(each.pid);
  return found.map((each) => `${each.name} ${each.pid}`);
};

export { sweepRun };
