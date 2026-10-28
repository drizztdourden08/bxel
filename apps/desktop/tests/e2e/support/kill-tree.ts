/* @layer renderer-app @kind logic */
import { spawnSync } from 'node:child_process';

const signalled = (target: number): boolean => {
  try {
    process.kill(target, 'SIGKILL');
    return true;
  } catch {
    return false;
  }
};

const killTree = (pid: number): void => {
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/F', '/T', '/PID', String(pid)]);
    return;
  }
  if (!signalled(-pid)) signalled(pid);
};

export { killTree };
