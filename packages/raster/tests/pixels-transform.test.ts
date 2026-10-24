/* @layer tests @kind test */
import { findSprite } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { fullMask, transformMask, transformRegion } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { expectLockedInk } from './expect-locked-ink';
import { heartIds, heartArtwork } from './heart-artwork';
import { maskFromRows } from './mask-from-rows';
import { documentId, pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { celRows, errorOf, expectUntouched, okOf } from './result-checks';
import { emptyArtwork, rowsIds, rowsArtwork } from './rows-artwork';
import { transformIds, transformArtwork } from './transform-artwork';

const PIXELS = ['.....', '.123.', '.45..', '.....', '.....', '.....'];
const MASK = maskFromRows(['.....', '.###.', '.##..', '.....', '.....', '.....']);

const options = (extra: Record<string, unknown>, mask: MaskView = MASK) => ({ ...extra, mask });
const rowsScope = scopeOf([rowsIds.sprite]);
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel);

describe('pixels.flip results', () => {
  test('flips the masked region inside its bounding box as one undo step', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([stepOf('pixels.flip', rowsScope, options({ axis: 'horizontal' }))])));
    expect(rowsOf(engine)).toEqual(['.....', '.321.', '..54.', '.....', '.....', '.....']);
    expect(result.warnings).toEqual([]);
    expect(result.changes.sprites[0]?.cels[0]?.rect).toEqual({ x: 1, y: 1, width: 3, height: 2 });
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
    okOf(engine.redo({ documentId, expectedRevision: 3 }));
    expect(rowsOf(engine)).toEqual(['.....', '.321.', '..54.', '.....', '.....', '.....']);
  });

  test('a vertical flip swaps the rows of the box', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    okOf(engine.execute(request([stepOf('pixels.flip', rowsScope, options({ axis: 'vertical' }))])));
    expect(rowsOf(engine)).toEqual(['.....', '.45..', '.123.', '.....', '.....', '.....']);
  });

  test('flips the same mask on several sprites and leaves layers outside the names alone', () => {
    const engine = pixelEngine(heartArtwork());
    const original = engine.state().artwork;
    const mask = maskFromRows(['........', '..####..', '..####..', '........', '........', '........', '........', '........']);
    const scope = scopeOf([heartIds.heart, heartIds.heartB], { by: 'names', names: ['Body'] });
    const result = okOf(engine.execute(request([stepOf('pixels.flip', scope, options({ axis: 'vertical' }, mask))])));
    expect(result.changes.sprites).toHaveLength(2);
    for (const [sprite, cel] of [[heartIds.heart, heartIds.cel], [heartIds.heartB, heartIds.celB]] as const) {
      const base = findSprite(original, sprite);
      const expected = { pixels: base?.cels[cel]?.pixels.slice() ?? new Uint8Array(), width: 8, height: 8 };
      transformRegion({ target: expected, mask, orientation: 'flip-vertical' });
      expect(findSprite(engine.state().artwork, sprite)?.cels[cel]?.pixels).toEqual(expected.pixels);
    }
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
  });

  test('flips a cel shared by two frames once', () => {
    const engine = pixelEngine(transformArtwork());
    const mask = maskFromRows(['###']);
    okOf(engine.execute(request([stepOf('pixels.flip', scopeOf([transformIds.linked]), { axis: 'horizontal', mask })])));
    expect(celRows(engine.state().artwork, transformIds.linked, transformIds.linkedBody)).toEqual(['321']);
  });
});

describe('pixels.flip guards', () => {
  test('refuses a locked layer named by id and writes nothing', () => {
    expectLockedInk('pixels.flip', { axis: 'horizontal', mask: fullMask({ width: 8, height: 8 }) });
    expectLockedInk('pixels.turn', { direction: 'clockwise', mask: fullMask({ width: 8, height: 8 }) });
  });

  test('an empty mask is a no-op, and a layer with no cel yet stays without one', () => {
    const engine = pixelEngine(emptyArtwork(4, 2));
    const nothing = maskFromRows(['....', '....']);
    expect(okOf(engine.execute(request([stepOf('pixels.flip', rowsScope, { axis: 'horizontal', mask: nothing })]))).noop).toBe(true);
    const some = maskFromRows(['##..', '....']);
    expect(okOf(engine.execute(request([stepOf('pixels.flip', rowsScope, { axis: 'horizontal', mask: some })]))).noop).toBe(true);
    expect(engine.state().revision).toBe(1);
    expect(engine.canUndo()).toBe(false);
    expect(findSprite(engine.state().artwork, rowsIds.sprite)?.cels).toEqual({});
  });

  test('rejects a missing mask, a mask of the wrong length and unknown options', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const broken = { width: 5, height: 6, bits: new Uint8Array(3) };
    for (const bad of [{ axis: 'horizontal' }, { axis: 'horizontal', mask: broken }, { axis: 'sideways', mask: MASK }, { axis: 'vertical', mask: MASK, extra: 1 }]) {
      expect(errorOf(engine.execute(request([stepOf('pixels.flip', rowsScope, bad)]))).code).toBe('INVALID_OPTION');
    }
  });

  test('refuses a mask that does not match the sprite size', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const before = engine.state().artwork;
    const small = maskFromRows(['##', '##']);
    const error = errorOf(engine.execute(request([stepOf('pixels.flip', rowsScope, { axis: 'horizontal', mask: small })])));
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
    expect(error.details[0]?.spriteId).toBe(rowsIds.sprite);
    expectUntouched(engine, before);
  });

  test('preview equals commit and changes nothing', () => {
    const previewed = pixelEngine(rowsArtwork(PIXELS));
    const base = previewed.state().artwork;
    const step = stepOf('pixels.flip', rowsScope, options({ axis: 'horizontal' }));
    const preview = okOf(previewed.execute(request([step], { mode: 'preview', previewPixels: 4096 })));
    expectUntouched(previewed, base);
    expect(preview.changes).toEqual(okOf(pixelEngine(rowsArtwork(PIXELS)).execute(request([step]))).changes);
  });
});

describe('pixels.turn', () => {
  test('turns the masked region about the top left corner of its box', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([stepOf('pixels.turn', rowsScope, options({ direction: 'clockwise' }))])));
    expect(rowsOf(engine)).toEqual(['.....', '.41..', '.52..', '..3..', '.....', '.....']);
    expect(result.warnings).toEqual([]);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
  });

  test('counter-clockwise and half turns', () => {
    const counter = pixelEngine(rowsArtwork(PIXELS));
    okOf(counter.execute(request([stepOf('pixels.turn', rowsScope, options({ direction: 'counter-clockwise' }))])));
    expect(rowsOf(counter)).toEqual(['.....', '.3...', '.25..', '.14..', '.....', '.....']);
    const half = pixelEngine(rowsArtwork(PIXELS));
    okOf(half.execute(request([stepOf('pixels.turn', rowsScope, options({ direction: 'half' }))])));
    expect(rowsOf(half)).toEqual(['.....', '..54.', '.321.', '.....', '.....', '.....']);
  });

  test('reports what is clipped at the sprite edge and still undoes exactly', () => {
    const mask = maskFromRows(['.....', '.###.', '.##..']);
    const engine = pixelEngine(rowsArtwork(['.....', '.123.', '.45..']));
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([stepOf('pixels.turn', rowsScope, { direction: 'clockwise', mask })])));
    expect(rowsOf(engine)).toEqual(['.....', '.41..', '.52..']);
    expect(result.warnings).toEqual([
      { code: 'PIXELS_CLIPPED', step: 0, message: '1 masked pixel(s) moved outside the sprite and were dropped.' },
    ]);
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
  });

  test('four turns with the mask carried along restore the pixels', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const original = engine.state().artwork;
    const steps = [];
    let mask = MASK;
    for (let turn = 0; turn < 4; turn++) {
      steps.push(stepOf('pixels.turn', rowsScope, { direction: 'clockwise', mask }));
      mask = transformMask(mask, 'turn-clockwise');
    }
    const result = okOf(engine.execute(request(steps)));
    expect(result.warnings).toEqual([]);
    expect(engine.state().artwork).toEqual(original);
  });

  test('rejects an unknown direction', () => {
    const engine = pixelEngine(rowsArtwork(PIXELS));
    const step = stepOf('pixels.turn', rowsScope, options({ direction: 'left' }));
    expect(errorOf(engine.execute(request([step]))).code).toBe('INVALID_OPTION');
  });
});
