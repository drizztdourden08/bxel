/* @layer renderer-app @kind constants */
import type { InkKind } from '../stores/drawing-store.type';
import type { InkBuilder } from './ink-of.type';
import type { ColourSlot } from './press-plan.type';

const PARTNER: Readonly<Record<ColourSlot, ColourSlot>> = {
  foreground: 'background',
  background: 'foreground',
  third: 'fourth',
  fourth: 'third',
};

const INK_BUILDERS: Readonly<Record<InkKind, InkBuilder>> = {
  normal: () => undefined,
  behind: () => ({ kind: 'behind' }),
  lockAlpha: () => ({ kind: 'lockAlpha' }),
  onlyColour: ({ drawing, other }) => ({ kind: 'onlyColour', index: drawing.onlyColour ?? other }),
  dither: ({ drawing, other }) => ({ kind: 'dither', pattern: drawing.ditherPattern, level: drawing.ditherLevel, second: other }),
  shade: ({ drawing, reversed }) => ({
    kind: 'shade',
    ...(drawing.shadeRamp === null ? {} : { ramp: drawing.shadeRamp }),
    direction: reversed ? 'down' : 'up',
    steps: drawing.shadeSteps,
  }),
  lighten: ({ drawing, reversed }) => ({ kind: reversed ? 'darken' : 'lighten', steps: drawing.shadeSteps }),
  darken: ({ drawing, reversed }) => ({ kind: reversed ? 'lighten' : 'darken', steps: drawing.shadeSteps }),
};

export { INK_BUILDERS, PARTNER };
