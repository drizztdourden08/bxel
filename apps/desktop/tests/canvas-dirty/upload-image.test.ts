/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { markDirty } from '../../src/canvas-dirty/mark-dirty';
import { trackPixels } from '../../src/canvas-dirty/track-pixels';
import { uploadImage } from '../../src/canvas-dirty/upload-image';
import type { PixelCanvas, PixelContext, PixelImage } from '../../src/canvas-dirty/upload-image.type';

type Put = readonly number[];

const SIDE = 8;

const image = (tracked: boolean): PixelImage => {
  const data = new Uint8ClampedArray(SIDE * SIDE * 4);
  if (tracked) trackPixels(data);
  return { data, width: SIDE, height: SIDE };
};

const surface = () => {
  const puts: Put[] = [];
  const canvas: PixelCanvas = { width: 0, height: 0 };
  const ctx: PixelContext = {
    putImageData: (_image, ...rest) => {
      puts.push(rest.filter((value): value is number => value !== undefined));
    },
  };
  return { canvas, ctx, puts, draw: (source: PixelImage) => uploadImage(canvas, ctx, source) };
};

describe('uploadImage', () => {
  it('sends the whole image the first time and nothing when nothing changed', () => {
    const { draw, puts } = surface();
    const source = image(true);
    draw(source);
    draw(source);
    expect(puts).toEqual([[0, 0]]);
  });

  it('sends only the rectangle that was marked dirty, merged across several marks', () => {
    const { draw, puts } = surface();
    const source = image(true);
    draw(source);
    markDirty(source.data, { x: 1, y: 2, width: 2, height: 2 });
    markDirty(source.data, { x: 4, y: 3, width: 1, height: 3 });
    draw(source);
    draw(source);
    expect(puts).toEqual([
      [0, 0],
      [0, 0, 1, 2, 4, 4],
    ]);
  });

  it('sends the whole image again for a different source, a resized canvas or an untracked image', () => {
    const { draw, puts, canvas } = surface();
    const first = image(true);
    const second = image(true);
    draw(first);
    draw(second);
    markDirty(second.data, { x: 0, y: 0, width: 1, height: 1 });
    draw(first);
    const loose = image(false);
    draw(loose);
    draw(loose);
    expect(canvas.width).toBe(SIDE);
    expect(puts).toEqual([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
  });

  it('ignores marks on an image that is not tracked', () => {
    const { draw, puts } = surface();
    const loose = image(false);
    markDirty(loose.data, { x: 0, y: 0, width: 2, height: 2 });
    draw(loose);
    draw(loose);
    expect(puts).toEqual([[0, 0], [0, 0]]);
  });
});
