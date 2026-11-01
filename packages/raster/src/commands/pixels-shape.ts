/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand } from '@bxel/document';
import { applyInked } from './apply-inked';
import { checkPointCount } from './check-point-count';
import { checkTargets } from './check-targets';
import { resolveBrush } from './resolve-brush';
import { drawShapeOptions } from './draw-shape-options';
import { withInkIndex } from './ink-indexes';
import { pixelsShapeSchema } from './schema/pixels-shape-schema';

const pixelsShape = defineCommand({
  name: COMMAND_NAME.pixelsShape,
  scope: 'cels',
  schema: pixelsShapeSchema,
  run: (draft, input) => {
    const { options } = input;
    const brush = resolveBrush(draft.artwork, options.brush);
    if ('points' in options) {
      checkPointCount(options.points.length, input.step);
    }
    const highest = Math.max(options.index, options.fillIndex ?? 0);
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: withInkIndex(highest, options.ink), mask: options.mask });
    applyInked({ draft, cels: input.cels, ink: options.ink }, (target, rule) => drawShapeOptions(target, options, rule, brush));
  },
});

export { pixelsShape };
