/* @layer tests @kind helper */
import type { ExportSprite } from '@bxel/formats';
import { makeRgbaPalette } from './make-rgba-palette';

type SpriteSpec = {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly frames: number;
};

const fillRect = (
  layer: Uint8Array,
  width: number,
  rect: readonly [number, number, number, number],
  index: number,
): void => {
  const [left, top, right, bottom] = rect;
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) layer[y * width + x] = index;
  }
};

const makeExportSprite = (spec: SpriteSpec): ExportSprite => {
  const { name, width, height } = spec;
  const frames = Array.from({ length: spec.frames }, (_, f) => {
    const body = new Uint8Array(width * height);
    const mark = new Uint8Array(width * height);
    fillRect(body, width, [1 + f, 1 + f, width - 2, height - 1 - f], 1 + (f % 4));
    mark[(height - 2 - f) * width + (width - 2)] = 5;
    return { layers: [body, mark], durationMs: 40 + 25 * f };
  });
  return {
    name,
    width,
    height,
    pivot: { x2: width, y2: height * 2 - 1 },
    palette: makeRgbaPalette(6, 0),
    frames,
    tags: spec.frames > 1 ? [{ name: 'loop', from: 0, to: spec.frames - 1, direction: 'pingpong', repeat: 2 }] : [],
    slices: [
      {
        name: `${name}-hit`,
        bounds: { x: 1, y: 1, width: width - 2, height: height - 2 },
        pivot: { x2: 3, y2: 5 },
        center: { x: 2, y: 2, width: 2, height: 2 },
      },
    ],
  };
};

export { makeExportSprite };
