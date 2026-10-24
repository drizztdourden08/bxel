/* @layer core @kind config */
import type { FlipAxis, TurnDirection } from '@bxel/document';
import type { Orientation, TransformPlan } from './transform.type';

const TRANSFORM_PLANS: Readonly<Record<Orientation, TransformPlan>> = {
  'flip-horizontal': { turned: false, to: (x, y, width) => y * width + (width - 1 - x) },
  'flip-vertical': { turned: false, to: (x, y, width, height) => (height - 1 - y) * width + x },
  'turn-clockwise': { turned: true, to: (x, y, _width, height) => x * height + (height - 1 - y) },
  'turn-counter-clockwise': { turned: true, to: (x, y, width, height) => (width - 1 - x) * height + y },
  'half-turn': { turned: false, to: (x, y, width, height) => (height - 1 - y) * width + (width - 1 - x) },
};

const FLIP_ORIENTATION: Readonly<Record<FlipAxis, Orientation>> = {
  horizontal: 'flip-horizontal',
  vertical: 'flip-vertical',
};

const TURN_ORIENTATION: Readonly<Record<TurnDirection, Orientation>> = {
  clockwise: 'turn-clockwise',
  'counter-clockwise': 'turn-counter-clockwise',
  half: 'half-turn',
};

export { FLIP_ORIENTATION, TRANSFORM_PLANS, TURN_ORIENTATION };
