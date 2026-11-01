/* @layer renderer-app @kind logic */
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { connectMcp } from './connect-mcp';
import { RM_OPTIONS } from './e2e.constants';
import { makeTempDir } from './make-temp-dir';
import type { RememberedLink } from './mcp.type';
import { rememberProgram } from './remember-program';

const openRememberedLink = async (prepare?: (userData: string) => Promise<void>): Promise<RememberedLink> => {
  const dir = await makeTempDir();
  try {
    const userData = join(dir, 'profile');
    const config = await rememberProgram(userData, dir);
    if (prepare) await prepare(userData);
    return { dir, userData, config, link: await connectMcp(config) };
  } catch (error) {
    await rm(dir, RM_OPTIONS);
    throw error;
  }
};

export { openRememberedLink };
