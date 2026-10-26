/* @layer renderer-app @kind logic */
import { buildTideArtwork } from './build-tide-artwork';
import { openProjectAtInUi } from './open-project-at-in-ui';
import { openProjectRig } from './open-project-rig';
import type { ProjectRig } from './project-rig.type';
import { setProjectAccessInUi } from './set-project-access-in-ui';
import { TIDE } from './tide.constants';
import { writeSampleProject } from './write-sample-project';

const openTideProjectRig = async (): Promise<ProjectRig> => {
  const rig = await openProjectRig();
  await writeSampleProject(rig.projectDir, buildTideArtwork(), TIDE.project);
  await openProjectAtInUi(rig.session, rig.projectDir, TIDE.project);
  await setProjectAccessInUi(rig.session, TIDE.project, 'Read and edit');
  return rig;
};

export { openTideProjectRig };
