/* @layer tests @kind test */
import type { FrameId, TargetScope } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { brand } from './brand';
import { pixelEngine, request, stepOf } from './pixel-engine';
import { celRows, errorOf, expectUntouched, okOf } from './result-checks';
import { transformArtwork, transformIds } from './transform-artwork';

const FIRST_FRAME = brand<FrameId>('frm_000062');
const firstFrameOnly: TargetScope = {
  sprites: [transformIds.linked],
  layers: { by: 'all' },
  frames: { by: 'ids', ids: [FIRST_FRAME] },
};
const paint = (extra: Record<string, unknown> = {}) =>
  stepOf('pixels.paint', firstFrameOnly, {
    index: 4,
    points: [{ x: 0, y: 0 }],
    brush: { shape: 'square', size: 1 },
    ...extra,
  });

describe('pixels.paint on a linked cel', () => {
  test('fails CEL_LINKED when only one use is targeted and changes nothing', () => {
    const engine = pixelEngine(transformArtwork());
    const before = engine.state().artwork;
    const error = errorOf(engine.execute(request([paint()])));
    expect(error.code).toBe('CEL_LINKED');
    expectUntouched(engine, before);
  });

  test('paints the shared cel with allUses', () => {
    const engine = pixelEngine(transformArtwork());
    okOf(engine.execute(request([paint({ allUses: true })])));
    expect(celRows(engine.state().artwork, transformIds.linked, transformIds.linkedBody)).toEqual(['423']);
  });
});
