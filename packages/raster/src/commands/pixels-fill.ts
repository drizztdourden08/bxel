/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand, flattenFrame, requireBank, requireSprite } from '@bxel/document';
import type { ResolvedCel } from '@bxel/document';
import { fillInked } from '../fill-inked';
import { floodFill } from '../flood-fill';
import { mirrorPoints } from '../mirror-points';
import { unionRects } from '../union-rects';
import { applyInked } from './apply-inked';
import { checkSeed } from './check-seed';
import { checkTargets } from './check-targets';
import { withInkIndex } from './ink-indexes';
import { rampClasses } from './ramp-classes';
import { pixelsFillSchema } from './schema/pixels-fill-schema';

const pixelsFill = defineCommand({
  name: COMMAND_NAME.pixelsFill,
  scope: 'cels',
  schema: pixelsFillSchema,
  run: (draft, input) => {
    const { x, y, index, mode, connectivity, mask, wrap, ink, symmetry, sample, match } = input.options;
    const seed = { x, y };
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: withInkIndex(index, ink), mask });
    checkSeed({ artwork: draft.artwork, sprites: input.sprites, seed, wrap });
    const seeds = mirrorPoints({ points: [seed], symmetry }).map((variant) => variant[0] ?? seed);
    const plain = (ink === undefined || ink.kind === 'normal') && sample === 'layer' && match === 'index';
    applyInked({ draft, cels: input.cels, ink }, (target, rule, cel: ResolvedCel) => {
      if (plain) {
        return unionRects(seeds.map((at) => floodFill({ target, seed: at, index, mode, connectivity, mask, wrap })));
      }
      const artwork = draft.artwork;
      const flat = sample === 'visible' ? flattenFrame(requireSprite(artwork, cel.spriteId), cel.frameId) : undefined;
      const classes = match === 'ramp' ? rampClasses(requireBank(artwork, requireSprite(artwork, cel.spriteId).bankId)) : undefined;
      return unionRects(seeds.map((at) => fillInked({ target, sample: flat, classes, seed: at, index, mode, connectivity, mask, wrap, ink: rule })));
    });
  },
});

export { pixelsFill };
