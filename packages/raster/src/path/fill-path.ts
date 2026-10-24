/* @layer core @kind logic */
import type { Point } from '../geometry.type';
import type { PixelWriter } from '../paint.type';
import { polygonMask } from '../selection/polygon-mask';
import { writePixel } from '../write-pixel';

const fillPath = (writer: PixelWriter, vertices: readonly Point[]): void => {
  const { width, height } = writer.target;
  const inside = polygonMask({ width, height }, vertices);
  for (const [at, bit] of inside.bits.entries()) {
    if (bit !== 0) {
      writePixel(writer, at % width, Math.floor(at / width));
    }
  }
};

export { fillPath };
