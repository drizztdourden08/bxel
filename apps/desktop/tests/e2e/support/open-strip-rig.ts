/* @layer renderer-app @kind logic */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './e2e.constants';
import type { Session } from './e2e.type';
import { buildStripArtwork } from './build-strip-artwork';
import { openProjectAtInUi } from './open-project-at-in-ui';
import { openSession } from './open-session';
import { STRIP } from './strip-project.constants';
import { writeSampleProject } from './write-sample-project';

type StripRig = { readonly session: Session; readonly root: string };

const openStripRig = async (): Promise<StripRig> => {
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  const root = join(place, STRIP.project);
  await writeSampleProject(root, buildStripArtwork(), STRIP.project);
  const session = await openSession();
  await openProjectAtInUi(session, root, STRIP.project);
  const close = session.close;
  return { session: { ...session, close: () => close().then(() => rm(place, { recursive: true, force: true })) }, root };
};

export { openStripRig };
export type { StripRig };
