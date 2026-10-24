/* @layer renderer-app @kind logic */
import { RANGES } from './canvas-look.constants';
import type { GridLine, LineDefaults, LineFields, NumberRange } from './canvas-look.type';
import { clampSetting } from './clamp-setting';
import { colourOr } from './colour-or';

const gridLineOf = (fields: LineFields, range: NumberRange, defaults: LineDefaults): GridLine => ({
  colour: colourOr(fields.colour, defaults.colour),
  opacity: clampSetting(fields.opacity, RANGES.opacity, defaults.opacity),
  every: Math.round(clampSetting(fields.every, range, defaults.every)),
});

export { gridLineOf };
