/* @layer renderer-app @kind constants */
import type { TurnDirection } from '@bxel/document';

const TURN_DEGREES: Readonly<Record<TurnDirection, number>> = {
  clockwise: 90,
  'counter-clockwise': -90,
  half: 180,
};

export { TURN_DEGREES };
