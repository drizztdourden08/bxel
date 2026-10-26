/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { beforeEach } from 'vitest';
import { waterSteps } from '../water-steps';
import { writeProjectAssets } from '../workspace/workspace-harness';
import { artworkFromSteps } from './artwork-from-steps';
import { ROOT } from './project-harness';
import { toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

type AnimatedWorld = {
  readonly rig: ToolRig;
  readonly artwork: Artwork;
  readonly paths: ReadonlyMap<string, string>;
};

const animatedArtwork = (): Artwork => artworkFromSteps('Water', waterSteps({ side: 8, frameMs: 100, indexes: [1, 2], columns: 4, rows: 3 }));

const openAnimatedWorld = (): (() => AnimatedWorld) => {
  const held: { world?: AnimatedWorld } = {};
  beforeEach(async () => {
    const artwork = animatedArtwork();
    let paths: ReadonlyMap<string, string> = new Map();
    const rig = await toolRig({
      seed: (disk) => {
        paths = writeProjectAssets(disk, ROOT, artwork);
      },
    });
    held.world = { rig, artwork, paths };
  });
  return () => {
    if (!held.world) throw new Error('the project did not open');
    return held.world;
  };
};

export { openAnimatedWorld };
