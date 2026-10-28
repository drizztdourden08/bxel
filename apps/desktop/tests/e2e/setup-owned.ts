/* @layer renderer-app @kind test */
import { appendFileSync } from 'node:fs';
import { afterAll } from 'vitest';
import { isAlive } from './support/is-alive';
import { killTree } from './support/kill-tree';
import { leaksFile } from './support/leaks-file';
import { OWNED_PIDS } from './support/owned-pids.constants';
import { E2E_RUN_ID } from './support/run-id.constants';

afterAll(() => {
  const left = [...OWNED_PIDS].filter(isAlive);
  for (const pid of left) killTree(pid);
  OWNED_PIDS.clear();
  if (left.length > 0) appendFileSync(leaksFile(E2E_RUN_ID), `A test file left Electron ${left.join(', ')} running; `);
});
