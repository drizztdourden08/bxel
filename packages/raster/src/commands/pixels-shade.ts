/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { shadeStroke } from '../shade/shade-stroke';
import { shadeTable } from '../shade/shade-table';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { checkPointCount } from './check-point-count';
import { checkTargets } from './check-targets';
import { resolveRamps } from './resolve-ramps';
import { pixelsShadeSchema } from './schema/pixels-shade-schema';
import { spriteCels } from './sprite-cels';

const pixelsShade = defineCommand({
  name: ADVANCED_COMMAND.pixelsShade,
  scope: 'cels',
  schema: pixelsShadeSchema,
  run: (draft, input) => {
    const { ramp, direction, steps, mask, ...stroke } = input.options;
    checkPointCount(stroke.points.length, input.step);
    checkTargets({ project: draft.project, sprites: input.sprites, index: 0, mask });
    const ramps = resolveRamps({ project: draft.project, sprites: input.sprites, name: ramp, needs: 1 });
    for (const [spriteId, slots] of ramps) {
      const table = shadeTable({ slots, direction, steps });
      applyToCels(draft, spriteCels(input.cels, spriteId), (target) => shadeStroke({ ...stroke, target, table, mask }));
    }
  },
});

export { pixelsShade };
