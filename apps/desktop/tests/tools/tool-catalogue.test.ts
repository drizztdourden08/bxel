/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import type { ToolSlot } from '../../src/editor/tool-catalogue/tool-catalogue.type';
import { SLOT_GROUPS } from '../../src/editor/tool-catalogue/tool-catalogue.constants';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const groupRank = (slot: ToolSlot): number => SLOT_GROUPS.findIndex((group) => group.id === slot.group);

describe('K1 the tool catalogue', { tags: ['critical'] }, () => {
  it('shows the slice tool and the view group on a sheet and lists groups in order', () => {
    expect(slotsOf('sheet').map((slot) => slot.id)).toEqual(['slice', 'zoom', 'hand']);
    const order = slotsOf('sprite').map(groupRank);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('shows the same slots on a sprite and a tile and lists them for no document', () => {
    expect(slotsOf('tile')).toEqual(slotsOf('sprite'));
    expect(slotsOf('none')).toEqual(slotsOf('sprite'));
  });
});
