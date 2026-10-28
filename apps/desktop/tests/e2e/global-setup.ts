/* @layer renderer-app @kind test */
import { randomBytes } from 'node:crypto';
import { readFileSync, rmSync } from 'node:fs';
import { leaksFile } from './support/leaks-file';
import { RUN_ENV } from './support/run-id.constants';
import { sweepRun } from './support/sweep-run';

const GRACE_MS = 8000;

const leaksOf = (runId: string): string => {
  try {
    return readFileSync(leaksFile(runId), 'utf8');
  } catch {
    return '';
  }
};

const watchSignals = (runId: string): void => {
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      sweepRun(runId, 0);
      if (process.listenerCount(signal) === 0) process.exit(signal === 'SIGINT' ? 130 : 143);
    });
  }
  process.once('exit', () => {
    sweepRun(runId, 0);
  });
};

const setup = (): (() => void) => {
  const runId = randomBytes(3).toString('hex');
  process.env[RUN_ENV] = runId;
  watchSignals(runId);
  return () => {
    const alive = sweepRun(runId, GRACE_MS);
    const earlier = leaksOf(runId);
    rmSync(leaksFile(runId), { force: true });
    if (alive.length > 0 || earlier !== '') {
      process.exitCode = 1;
      throw new Error(`The e2e run left Electron processes alive (killed now): ${[...alive, earlier.trim()].filter(Boolean).join('; ')}`);
    }
  };
};

export { setup };
