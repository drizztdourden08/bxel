/* @layer renderer-app @kind logic */
import { ANIMATED } from './animated-project.constants';
import { buildAnimatedArtwork } from './build-animated-artwork';
import { openArtworkRig } from './open-artwork-rig';
import type { SessionRig } from './session-rig.type';

const openAnimatedRig = (): Promise<SessionRig> => openArtworkRig(buildAnimatedArtwork(), ANIMATED.project);

export { openAnimatedRig };
