/* @layer renderer-app @kind logic */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { Artwork } from '@bxel/document';
import { buildTideArtwork } from './build-tide-artwork';
import { canvasMapper } from './canvas-mapper';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './e2e.constants';
import type { CellMapper, Session } from './e2e.type';
import { openAssetRow } from './open-asset-row';
import { openProjectAtInUi } from './open-project-at-in-ui';
import { openSession } from './open-session';
import { TIDE } from './tide.constants';
import { writeSampleProject } from './write-sample-project';

type TideRig = {
  readonly session: Session;
  readonly artwork: Artwork;
  readonly mapper: () => Promise<CellMapper>;
};

const openTideRig = async (): Promise<TideRig> => {
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  const artwork = buildTideArtwork();
  await writeSampleProject(join(place, TIDE.project), artwork, TIDE.project);
  const session = await openSession();
  await openProjectAtInUi(session, join(place, TIDE.project), TIDE.project);
  await openAssetRow(session, TIDE.map);
  await session.page.getByRole('application', { name: TIDE.label }).waitFor();
  const close = session.close;
  return {
    session: { ...session, close: () => close().then(() => rm(place, { recursive: true, force: true })) },
    artwork,
    mapper: () => canvasMapper(session, { width: TIDE.columns * TIDE.side, height: TIDE.rows * TIDE.side }, TIDE.label),
  };
};

export { openTideRig };
export type { TideRig };
