/* @layer renderer-app @kind logic */
import { rm } from 'node:fs/promises';
import { RM_OPTIONS } from './e2e.constants';
import { pathExists } from './path-exists';
import { stopOrphan } from './stop-orphan';

const releaseProfile = async (dir: string | null | undefined, bridgeFile: string | null | undefined): Promise<void> => {
  if (bridgeFile && (await pathExists(bridgeFile))) await stopOrphan(bridgeFile);
  if (dir) await rm(dir, RM_OPTIONS);
};

export { releaseProfile };
