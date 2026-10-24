/* @layer tests @kind helper */
import type { Box } from '@bxel/formats';

const separationGap = (a: Box, b: Box): number =>
  Math.max(
    b.x - (a.x + a.width),
    a.x - (b.x + b.width),
    b.y - (a.y + a.height),
    a.y - (b.y + b.height),
  );

export { separationGap };
