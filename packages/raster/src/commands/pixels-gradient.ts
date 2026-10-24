/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { gradientFill } from '../gradient/gradient-fill';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { checkTargets } from './check-targets';
import { rampRun } from './ramp-run';
import { resolveRamps } from './resolve-ramps';
import { pixelsGradientSchema } from './schema/pixels-gradient-schema';
import { spriteCels } from './sprite-cels';

const pixelsGradient = defineCommand({
  name: ADVANCED_COMMAND.pixelsGradient,
  scope: 'cels',
  schema: pixelsGradientSchema,
  run: (draft, input) => {
    const { ramp, first, last, line, mode, dither, origin, mask } = input.options;
    checkTargets({ project: draft.project, sprites: input.sprites, index: 0, mask });
    const needs = Math.max(first ?? 0, last ?? 0) + 1;
    const ramps = resolveRamps({ project: draft.project, sprites: input.sprites, name: ramp, needs });
    for (const [spriteId, slots] of ramps) {
      const colors = rampRun(slots, first, last);
      const bayer = mode === 'dither' ? dither : null;
      applyToCels(draft, spriteCels(input.cels, spriteId), (target) =>
        gradientFill({ target, mask, colors, line, bayer, origin }),
      );
    }
  },
});

export { pixelsGradient };
