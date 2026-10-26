/* @layer renderer-app @kind logic */
import { join } from 'node:path';
import { buildSampleArtwork } from './build-sample-artwork';
import type { Session } from './e2e.type';
import { openProjectAtInUi } from './open-project-at-in-ui';
import { openSheetTab } from './open-sheet-tab';
import { SAMPLE } from './sample.constants';
import { writeSampleProject } from './write-sample-project';

const openSampleSheet = async (session: Session, place: string): Promise<void> => {
  const root = join(place, 'Sample');
  await writeSampleProject(root, buildSampleArtwork(), SAMPLE.name);
  await openProjectAtInUi(session, root, SAMPLE.name);
  await openSheetTab(session, SAMPLE.sheets[0]);
};

export { openSampleSheet };
