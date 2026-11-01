/* @layer renderer-app @kind logic */
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TEMP_PREFIX } from './e2e.constants';

const makeTempDir = (): Promise<string> => mkdtemp(join(tmpdir(), TEMP_PREFIX));

export { makeTempDir };
