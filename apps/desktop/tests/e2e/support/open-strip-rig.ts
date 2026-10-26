/* @layer renderer-app @kind logic */
import { buildStripArtwork } from './build-strip-artwork';
import { openArtworkRig } from './open-artwork-rig';
import type { SessionRig } from './session-rig.type';
import { STRIP } from './strip-project.constants';

const openStripRig = (): Promise<SessionRig> => openArtworkRig(buildStripArtwork(), STRIP.project);

export { openStripRig };
