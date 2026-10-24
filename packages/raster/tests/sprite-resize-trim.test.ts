/* @layer tests @kind test */
import { findSprite } from '@bxel/document';
import type { Artwork, CelId, SpriteId } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { brand } from './brand';
import { buildArtwork } from './build-artwork';
import { documentId, pixelEngine, scopeOf, stepOf } from './pixel-engine';
import { okOf } from './result-checks';
import { applyStep, dimsOf, refusalOf, rowsOf } from './transform-checks';
import { transformIds as ids, transformArtwork } from './transform-artwork';

const small = brand<SpriteId>('spr_000070');
const smallCel = brand<CelId>('cel_000073');

const smallArtwork = (): Artwork =>
  buildArtwork([
    {
      id: 'spr_000070',
      name: 'small',
      width: 4,
      height: 4,
      pivot: { x2: 4, y2: 4 },
      frames: ['frm_000072'],
      layers: [{ id: 'lay_000071', name: 'Body', cels: { frm_000072: 'cel_000073' } }],
      cels: { cel_000073: ['....', '.12.', '.34.', '....'] },
    },
  ]);

describe('sprite.resize', () => {
  test('grows the canvas from the top left and keeps the pivot on the same pixel', () => {
    const engine = pixelEngine(transformArtwork());
    applyStep(engine, 'sprite.resize', scopeOf([ids.wide]), { width: 5, height: 4, anchor: 'top-left' });
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['123..', '4.5..', '.....', '.....']);
    expect(rowsOf(engine, ids.wide, ids.wideInk)).toEqual(['.1...', '..2..', '.....', '.....']);
    expect(dimsOf(engine, ids.wide)).toEqual({ width: 5, height: 4, pivot: { x2: 1, y2: 4 } });
  });

  test('centres the old pixels and moves the pivot with them', () => {
    const engine = pixelEngine(transformArtwork());
    applyStep(engine, 'sprite.resize', scopeOf([ids.wide]), { width: 5, height: 4 });
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['.....', '.123.', '.4.5.', '.....']);
    expect(dimsOf(engine, ids.wide).pivot).toEqual({ x2: 3, y2: 6 });
  });

  test('crops from the bottom right, warns about lost pixels and keeps the pivot inside', () => {
    const engine = pixelEngine(transformArtwork());
    const result = applyStep(engine, 'sprite.resize', scopeOf([ids.wide]), { width: 2, height: 1, anchor: 'bottom-right' });
    expect(result.warnings.map((warning) => warning.code)).toEqual(['SPRITE_CLIPPED']);
    expect(rowsOf(engine, ids.wide, ids.wideBody)).toEqual(['.5']);
    expect(dimsOf(engine, ids.wide)).toEqual({ width: 2, height: 1, pivot: { x2: 0, y2: 2 } });
  });

  test('resizes several sprites in one undo step and undo restores them', () => {
    const engine = pixelEngine(transformArtwork());
    const original = engine.state().artwork;
    const result = applyStep(engine, 'sprite.resize', scopeOf([ids.wide, ids.tall]), { width: 6, height: 6, anchor: 'bottom' });
    expect(result.revision).toBe(2);
    expect(dimsOf(engine, ids.wide)).toMatchObject({ width: 6, height: 6 });
    expect(dimsOf(engine, ids.tall)).toMatchObject({ width: 6, height: 6 });
    okOf(engine.undo({ documentId, expectedRevision: 2 }));
    expect(engine.state().artwork).toEqual(original);
  });

  test('leaves a sprite of the asked size alone and refuses a size above the limit', () => {
    const engine = pixelEngine(transformArtwork());
    const result = applyStep(engine, 'sprite.resize', scopeOf([ids.wide]), { width: 3, height: 2 });
    expect(result.changes.sprites).toEqual([]);
    const refusal = refusalOf(engine, stepOf('sprite.resize', scopeOf([ids.wide]), { width: 4000, height: 2 }));
    expect(refusal.code).toBe('INVALID_OPTION');
  });
});

describe('sprite.trim', () => {
  test('crops to the opaque pixels of every cel and moves the pivot with them', () => {
    const engine = pixelEngine(smallArtwork());
    const result = applyStep(engine, 'sprite.trim', scopeOf([small]), {});
    expect(result.warnings).toEqual([]);
    expect(rowsOf(engine, small, smallCel)).toEqual(['12', '34']);
    expect(dimsOf(engine, small)).toEqual({ width: 2, height: 2, pivot: { x2: 2, y2: 2 } });
  });

  test('keeps a sprite whose cels already touch every edge', () => {
    const engine = pixelEngine(transformArtwork());
    const result = applyStep(engine, 'sprite.trim', scopeOf([ids.tall]), {});
    expect(result.changes.sprites).toEqual([]);
  });

  test('uses the union of all frames, so no frame loses a pixel', () => {
    const engine = pixelEngine(transformArtwork());
    const result = applyStep(engine, 'sprite.trim', scopeOf([ids.wide]), {});
    expect(result.changes.sprites).toEqual([]);
    expect(findSprite(engine.state().artwork, ids.wide)?.width).toBe(3);
  });
});
