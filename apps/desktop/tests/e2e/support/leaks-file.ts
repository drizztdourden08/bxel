/* @layer renderer-app @kind logic */
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const leaksFile = (runId: string): string => join(tmpdir(), `bxel-e2e-run-${runId}.leaks`);

export { leaksFile };
