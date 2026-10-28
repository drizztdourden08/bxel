/* @layer renderer-app @kind logic */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { launchAppForTest } from '@drizztdourden08/brock-build/testing';
import { TEMP_PREFIX } from './e2e.constants';
import { isAlive } from './is-alive';
import { killTree } from './kill-tree';
import { OWNED_PIDS } from './owned-pids.constants';

type OwnedOptions = Parameters<typeof launchAppForTest>[0];

type OwnedApp = Awaited<ReturnType<typeof launchAppForTest>>;

const launchOwned = async (options: OwnedOptions): Promise<OwnedApp> => {
  const ownProfile = options.userData === undefined;
  const userData = options.userData ?? (await mkdtemp(join(tmpdir(), `${TEMP_PREFIX}profile-`)));
  const launched = await launchAppForTest({ ...options, userData }).catch(async (error: unknown) => {
    if (ownProfile) await rm(userData, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
    throw error;
  });
  const pid = launched.app.process().pid;
  if (pid !== undefined) OWNED_PIDS.add(pid);
  const close = async (): Promise<void> => {
    try {
      await launched.close();
    } finally {
      if (pid !== undefined) {
        if (isAlive(pid)) killTree(pid);
        OWNED_PIDS.delete(pid);
      }
      if (ownProfile) await rm(userData, { recursive: true, force: true, maxRetries: 20, retryDelay: 500 });
    }
  };
  return { ...launched, close };
};

export { launchOwned };
