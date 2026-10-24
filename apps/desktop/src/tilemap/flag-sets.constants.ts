/* @layer renderer-app @kind constants */
import type { CellFlags, Point } from '@bxel/document';

const ALL_FLAGS: readonly CellFlags[] = [false, true].flatMap((flipX) =>
  [false, true].flatMap((flipY) => [false, true].map((diagonal) => ({ flipX, flipY, diagonal }))),
);

const TURN_SAMPLE = 3;

const SAMPLE_POINTS: readonly Point[] = Array.from({ length: TURN_SAMPLE * TURN_SAMPLE }, (_, at) => ({
  x: at % TURN_SAMPLE,
  y: Math.floor(at / TURN_SAMPLE),
}));

export { ALL_FLAGS, SAMPLE_POINTS, TURN_SAMPLE };
