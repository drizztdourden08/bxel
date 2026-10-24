/* @layer core @kind logic */
import { defineCommand, maxIndex } from '@bxel/document';
import { stampPatch } from '../stamp/stamp-patch';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { checkPointCount } from './check-point-count';
import { checkTargets } from './check-targets';
import { pixelsStampSchema } from './schema/pixels-stamp-schema';
import { uniqueCels } from './unique-cels';

const pixelsStamp = defineCommand({
  name: ADVANCED_COMMAND.pixelsStamp,
  scope: 'cels',
  schema: pixelsStampSchema,
  run: (draft, input) => {
    const { patch, points, anchor, skipZero, mask } = input.options;
    checkPointCount(points.length, input.step);
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: maxIndex(patch.pixels), mask });
    applyToCels(draft, uniqueCels(input.cels), (target) =>
      stampPatch({ target, patch, points, anchor, skipZero, mask }),
    );
  },
});

export { pixelsStamp };
