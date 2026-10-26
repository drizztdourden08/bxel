/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import { managerAssets } from './manager-assets';
import { openHub } from './open-hub';
import { openProjectAtInUi } from './open-project-at-in-ui';
import { SAMPLE } from './sample.constants';

const chooseManagerAsset = async (session: Session, project: string, name: string): Promise<void> => {
  await openProjectAtInUi(session, project, SAMPLE.name);
  await openHub(session, 'Project');
  await managerAssets(session).getByRole('listitem').filter({ hasText: name }).first().click();
};

export { chooseManagerAsset };
