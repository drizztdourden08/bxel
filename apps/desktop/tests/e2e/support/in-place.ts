/* @layer renderer-app @kind logic */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './e2e.constants';

const inFreshPlace = async (run: (place: string) => Promise<void>): Promise<void> => {
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  try {
    await run(place);
  } finally {
    await rm(place, { recursive: true, force: true });
  }
};

export { inFreshPlace };
