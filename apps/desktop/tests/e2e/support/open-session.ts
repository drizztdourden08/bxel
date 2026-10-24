/* @layer renderer-app @kind logic */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { launchAppForTest } from '@drizztdourden08/brock-build/testing';
import { APP_DIR, CANVAS_LABEL, TEMP_PREFIX } from './e2e.constants';
import type { Session } from './e2e.type';

const openSession = async (): Promise<Session> => {
  const dir = await mkdtemp(join(tmpdir(), TEMP_PREFIX));
  const launched = await launchAppForTest({ appDir: APP_DIR });
  await launched.page.getByRole('application', { name: CANVAS_LABEL }).waitFor();
  return {
    app: launched.app,
    page: launched.page,
    dir,
    close: async () => {
      await launched.close();
      await rm(dir, { recursive: true, force: true });
    },
  };
};

export { openSession };
