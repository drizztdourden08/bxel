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
import { uniqueCels } from './unique-cels';

const pixelsGradient = defineCommand({
  name: ADVANCED_COMMAND.pixelsGradient,
  scope: 'cels',
  schema: pixelsGradientSchema,
  run: (draft, input) => {
    const { ramp, colors: listed, first, last, line, mode, dither, origin, mask, kind, reflect, pattern, wrap } = input.options;
    const bayer = mode === 'dither' ? dither : null;
    const shape = { line, bayer, origin, mask, kind, reflect, pattern, wrap };
    if (listed) {
      checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: Math.max(...listed), mask });
      applyToCels(draft, uniqueCels(input.cels), (target) => gradientFill({ target, colors: listed, ...shape }));
      return;
    }
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: 0, mask });
    const needs = Math.max(first ?? 0, last ?? 0) + 1;
    const ramps = resolveRamps({ artwork: draft.artwork, sprites: input.sprites, name: ramp ?? '', needs });
    for (const [spriteId, slots] of ramps) {
      const colors = rampRun(slots, first, last);
      applyToCels(draft, spriteCels(input.cels, spriteId), (target) => gradientFill({ target, colors, ...shape }));
    }
  },
});

export { pixelsGradient };
