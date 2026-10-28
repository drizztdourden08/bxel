/* @layer core @kind logic */
import { defineCommand, maxIndex } from '@bxel/document';
import { stampPatch } from '../stamp/stamp-patch';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyInked } from './apply-inked';
import { checkPointCount } from './check-point-count';
import { checkTargets } from './check-targets';
import { withInkIndex } from './ink-indexes';
import { savedBrushPatch } from './saved-brush-patch';
import { pixelsStampSchema } from './schema/pixels-stamp-schema';

const pixelsStamp = defineCommand({
  name: ADVANCED_COMMAND.pixelsStamp,
  scope: 'cels',
  schema: pixelsStampSchema,
  run: (draft, input) => {
    const { brushId, points, anchor, skipZero, flipX, flipY, turn, symmetry, ink, mask, wrap } = input.options;
    const patch = input.options.patch ?? savedBrushPatch(draft.artwork, brushId ?? '');
    checkPointCount(points.length, input.step);
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: withInkIndex(maxIndex(patch.pixels), ink), mask });
    applyInked({ draft, cels: input.cels, ink }, (target, rule) =>
      stampPatch({ target, patch, points, anchor, skipZero, flipX, flipY, turn, symmetry, ink: rule, mask, wrap }),
    );
  },
});

export { pixelsStamp };
