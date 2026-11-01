/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { plotDots } from '../plot-dots';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyInked } from './apply-inked';
import { checkPointCount } from './check-point-count';
import { checkTargets } from './check-targets';
import { resolveBrush } from './resolve-brush';
import { withInkIndex } from './ink-indexes';
import { pixelsPlotSchema } from './schema/pixels-plot-schema';

const pixelsPlot = defineCommand({
  name: ADVANCED_COMMAND.pixelsPlot,
  scope: 'cels',
  schema: pixelsPlotSchema,
  run: (draft, input) => {
    const { points, index, brush, ink, symmetry, mask, wrap } = input.options;
    checkPointCount(points.length, input.step);
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: withInkIndex(index, ink), mask });
    applyInked({ draft, cels: input.cels, ink }, (target, rule) =>
      plotDots({ target, index, mask, wrap, points, brush: resolveBrush(draft.artwork, brush), symmetry, ink: rule }),
    );
  },
});

export { pixelsPlot };
