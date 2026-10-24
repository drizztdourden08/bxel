/* @layer core @kind logic */
import type { Box } from '../pixels/box.type';

const scaleBox = (box: Box, factor: number): Box => ({
  x: box.x * factor,
  y: box.y * factor,
  width: box.width * factor,
  height: box.height * factor,
});

export { scaleBox };
