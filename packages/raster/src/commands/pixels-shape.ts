/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand } from '@bxel/document';
import { applyToCels } from './apply-to-cels';
import { checkPointCount } from './check-point-count';
import { checkTargets } from './check-targets';
import { drawShapeOptions } from './draw-shape-options';
import { pixelsShapeSchema } from './schema/pixels-shape-schema';

const pixelsShape = defineCommand({
  name: COMMAND_NAME.pixelsShape,
  scope: 'cels',
  schema: pixelsShapeSchema,
  run: (draft, input) => {
    const options = input.options;
    if ('points' in options) {
      checkPointCount(options.points.length, input.step);
    }
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: options.index, mask: options.mask });
    applyToCels(draft, input.cels, (target) => drawShapeOptions(target, options));
  },
});

export { pixelsShape };
