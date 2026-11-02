/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { slotBadge } from '../../src/views/ToolRail/behavior/slot-badge';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const state = { fillMode: 'contiguous', filled: false, mode: 'replace', tiled: 'off' } as const;

describe('K4 tiled badge on the pencil', { tags: ['critical'] }, () => {
  const pencil = slotsOf('sprite').find((slot) => slot.tool === 'pencil');

  it('shows no badge while tiled drawing is off', () => {
    if (!pencil) throw new Error('no pencil');
    expect(slotBadge(pencil, state)).toBeNull();
  });

  it('shows a badge while tiled drawing is on', () => {
    if (!pencil) throw new Error('no pencil');
    expect(slotBadge(pencil, { ...state, tiled: 'both' })?.glyph).toBe('T');
  });

  it('keeps other tools clean when tiled drawing is on', () => {
    const eraser = slotsOf('sprite').find((slot) => slot.tool === 'eraser');
    if (!eraser) throw new Error('no eraser');
    expect(slotBadge(eraser, { ...state, tiled: 'x' })).toBeNull();
  });
});
