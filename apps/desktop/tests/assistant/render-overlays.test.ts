/* @layer renderer-app @kind test */
import type { RgbaImage } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { artLineSet } from '../../src/assistant/tools/art-line-set';
import { cropRgba } from '../../src/assistant/tools/crop-rgba';
import { drawOverlayLines } from '../../src/assistant/tools/draw-overlay-lines';
import { mirrorRgba } from '../../src/assistant/tools/mirror-rgba';
import { overlayFit } from '../../src/assistant/tools/overlay-fit';
import { overlayRequest } from '../../src/assistant/tools/overlay-request';
import type { RenderInput } from '../../src/assistant/tools/tool-input.type';

const strip = (): RgbaImage => ({ data: Uint8ClampedArray.from([1, 0, 0, 255, 2, 0, 0, 255, 3, 0, 0, 255]), width: 3, height: 1 });

const tileset = (overlay: 'none' | 'collision'): RenderInput => ({ documentId: 'd', target: { tilesetId: 't', overlay }, scale: 4, overlays: ['collision', 'grid'] });

describe('W7 render_preview view options', { tags: ['critical'] }, () => {
  it('flips the image left to right and never changes a pixel value', () => {
    const flipped = mirrorRgba(strip());
    expect([0, 4, 8].map((at) => flipped.data[at])).toEqual([3, 2, 1]);
  });

  it('cuts the visible art rectangle out of the scaled image', () => {
    const wide: RgbaImage = { data: new Uint8ClampedArray(8 * 8 * 4).fill(9), width: 8, height: 8 };
    const cut = cropRgba(wide, { x: 1, y: 1, width: 1, height: 2 }, 2);
    expect([cut.width, cut.height]).toEqual([2, 4]);
  });

  it('puts grid, major and guide lines on the art pixel boundaries', () => {
    const art = { width: 16, height: 8, scale: 4, guides: { x: [5], y: [] } };
    expect(artLineSet('grid', art).columns.slice(0, 3)).toEqual([4, 8, 12]);
    expect(artLineSet('major', art).columns).toEqual([32]);
    expect(artLineSet('guides', art).columns).toEqual([20]);
    expect(artLineSet('guides', art).rows).toEqual([]);
  });

  it('draws a line as a blend over the pixels in its column', () => {
    const image: RgbaImage = { data: new Uint8ClampedArray(4 * 2 * 4), width: 4, height: 2 };
    drawOverlayLines(image, { ink: { rgb: [255, 255, 255], alpha: 1 }, columns: [2], rows: [] });
    expect(image.data[2 * 4]).toBe(255);
    expect(image.data[0]).toBe(0);
  });

  it('names the overlays that do not fit the target and switches the collision overlay on a tileset', () => {
    expect(overlayFit(tileset('none'))).toEqual({ applied: ['collision'], ignored: ['grid'] });
    expect(overlayRequest(tileset('none')).target).toMatchObject({ overlay: 'collision' });
  });
});
