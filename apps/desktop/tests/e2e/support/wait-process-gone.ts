/* @layer renderer-app @kind logic */
import { setTimeout as sleep } from 'node:timers/promises';

const alive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const waitProcessGone = async (pid: number, timeoutMs: number): Promise<boolean> => {
  const deadline = Date.now() + timeoutMs;
  while (alive(pid) && Date.now() < deadline) await sleep(250);
  return !alive(pid);
};

export { waitProcessGone };
