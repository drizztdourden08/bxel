/* @layer renderer-app @kind test */
import type { AnimFrameId, SpriteId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { celsScope } from '../../src/editor/cels-scope';
import type { CelsArtwork, CelsTarget } from '../../src/editor/cels-scope.type';
import { CELS_OPTIONS } from '../../src/editor/tool-options/specs/cels-options.constants';
import { DRAWING_DEFAULTS } from '../../src/stores/drawing-store.constants';

const spriteId = (name: string): SpriteId => name as SpriteId;

const frameId = (name: string): AnimFrameId => name as AnimFrameId;

const artwork: CelsArtwork = {
  sprites: [
    { id: spriteId('s1'), layers: [{ name: 'Layer 1' }] },
    { id: spriteId('s2'), layers: [{ name: 'Layer 1' }] },
    { id: spriteId('s3'), layers: [{ name: 'Other' }] },
  ],
};

const frames = ['a', 'b', 'c'].map((id, index) => ({ id: frameId(id), spriteId: spriteId(`s${index + 1}`) }));

const target = (sprite: string): CelsTarget => ({ sprite: { id: spriteId(sprite) }, layer: { name: 'Layer 1' }, animation: { animation: { frames } } });

describe('K1 the Cels choice', { tags: ['critical'] }, () => {
  it('defaults to this frame and is offered for pencil, eraser and fill', () => {
    expect(DRAWING_DEFAULTS.cels).toBe('frame');
    expect(CELS_OPTIONS.map((spec) => spec.tool)).toEqual(['pencil', 'eraser', 'fill']);
  });

  it('covers the sprites of the selected frames that hold the layer, in one scope', () => {
    const scope = celsScope(target('s1'), artwork, ['a', 'b', 'c'].map(frameId));
    expect(scope).toEqual({ sprites: ['s1', 's2'], layers: { by: 'names', names: ['Layer 1'] }, frames: { by: 'range', from: 0, to: 0 } });
  });

  it('falls back to the one cel when one frame is selected or the edited sprite is outside the selection', () => {
    expect(celsScope(target('s1'), artwork, [frameId('a')])).toBeNull();
    expect(celsScope(target('s1'), artwork, ['b', 'c'].map(frameId))).toBeNull();
  });
});
