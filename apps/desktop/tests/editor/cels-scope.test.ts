/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { celsScope } from '../../src/editor/cels-scope';
import type { EditorTarget } from '../../src/editor/editor.type';
import { CELS_OPTIONS } from '../../src/editor/tool-options/specs/cels-options.constants';
import { DRAWING_DEFAULTS } from '../../src/stores/drawing-store.constants';

const layer = (name: string) => ({ id: `l-${name}`, name });

const artwork = {
  sprites: [
    { id: 's1', layers: [layer('Layer 1')] },
    { id: 's2', layers: [layer('Layer 1')] },
    { id: 's3', layers: [layer('Other')] },
  ],
} as unknown as Artwork;

const frames = ['a', 'b', 'c'].map((id, index) => ({ id, spriteId: `s${index + 1}` }));

const target = (spriteId: string): EditorTarget =>
  ({ sprite: { id: spriteId }, layer: layer('Layer 1'), animation: { animation: { frames }, frame: frames[0] } }) as unknown as EditorTarget;

describe('K1 the Cels choice', { tags: ['critical'] }, () => {
  it('defaults to this frame and is offered for pencil, eraser and fill', () => {
    expect(DRAWING_DEFAULTS.cels).toBe('frame');
    expect(CELS_OPTIONS.map((spec) => spec.tool)).toEqual(['pencil', 'eraser', 'fill']);
  });

  it('covers the sprites of the selected frames that hold the layer, in one scope', () => {
    const scope = celsScope(target('s1'), artwork, ['a', 'b', 'c'] as never);
    expect(scope).toEqual({ sprites: ['s1', 's2'], layers: { by: 'names', names: ['Layer 1'] }, frames: { by: 'range', from: 0, to: 0 } });
  });

  it('falls back to the one cel when one frame is selected or the edited sprite is outside the selection', () => {
    expect(celsScope(target('s1'), artwork, ['a'] as never)).toBeNull();
    expect(celsScope(target('s1'), artwork, ['b', 'c'] as never)).toBeNull();
  });
});
