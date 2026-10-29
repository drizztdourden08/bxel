/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import type { Point } from '../geometry.type';
import type { Oriented } from './orient-patch.type';
import type { StampOrient } from './stamp.type';

const orientPatch = (patch: BufferView, anchor: Point, orient: StampOrient): Oriented => {
  const turns = ((orient.turn ?? 0) / 90) % 4;
  const swap = turns % 2 === 1;
  const width = swap ? patch.height : patch.width;
  const height = swap ? patch.width : patch.height;
  const pixels = new Uint8Array(width * height);
  const mapPoint = (sx: number, sy: number): Point => {
    let x = orient.flipX === true ? patch.width - 1 - sx : sx;
    let y = orient.flipY === true ? patch.height - 1 - sy : sy;
    let w = patch.width;
    let h = patch.height;
    for (let turn = 0; turn < turns; turn++) {
      const next = { x: h - 1 - y, y: x };
      x = next.x;
      y = next.y;
      [w, h] = [h, w];
    }
    return { x, y };
  };
  for (let sy = 0; sy < patch.height; sy++) {
    for (let sx = 0; sx < patch.width; sx++) {
      const to = mapPoint(sx, sy);
      pixels[to.y * width + to.x] = patch.pixels[sy * patch.width + sx] ?? 0;
    }
  }
  return { patch: { pixels, width, height }, anchor: mapPoint(anchor.x, anchor.y) };
};

export { orientPatch };
