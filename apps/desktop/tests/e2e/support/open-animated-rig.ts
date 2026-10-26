/* @layer renderer-app @kind logic */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { ANIMATED } from './animated-project.constants';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './e2e.constants';
import type { Session } from './e2e.type';
import { buildAnimatedArtwork } from './build-animated-artwork';
import { openProjectAtInUi } from './open-project-at-in-ui';
import { openSession } from './open-session';
import { writeSampleProject } from './write-sample-project';

type AnimatedRig = { readonly session: Session; readonly root: string };

const openAnimatedRig = async (): Promise<AnimatedRig> => {
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  const root = join(place, ANIMATED.project);
  await writeSampleProject(root, buildAnimatedArtwork(), ANIMATED.project);
  const session = await openSession();
  await openProjectAtInUi(session, root, ANIMATED.project);
  const close = session.close;
  return { session: { ...session, close: () => close().then(() => rm(place, { recursive: true, force: true })) }, root };
};

export { openAnimatedRig };
export type { AnimatedRig };
