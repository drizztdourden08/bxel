/* @layer renderer-app @kind logic */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { Artwork } from '@bxel/document';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './e2e.constants';
import type { SessionRig } from './session-rig.type';
import { openProjectAtInUi } from './open-project-at-in-ui';
import { openSession } from './open-session';
import { writeSampleProject } from './write-sample-project';

const openArtworkRig = async (artwork: Artwork, name: string): Promise<SessionRig> => {
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  const root = join(place, name);
  await writeSampleProject(root, artwork, name);
  const session = await openSession();
  await openProjectAtInUi(session, root, name);
  const close = session.close;
  return { session: { ...session, close: () => close().then(() => rm(place, { recursive: true, force: true })) }, root };
};

export { openArtworkRig };
