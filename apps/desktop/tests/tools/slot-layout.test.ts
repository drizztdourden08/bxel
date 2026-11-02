/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { arrangeSlots } from '../../src/editor/tool-catalogue/arrange-slots';
import { moveSlot } from '../../src/editor/tool-catalogue/move-slot';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { stepSlot } from '../../src/editor/tool-catalogue/step-slot';
import { parsePrefs } from '../../src/editor/tool-options/parse-prefs';
import { useToolPrefsStore } from '../../src/stores/useToolPrefsStore';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const idsOf = (surface: 'sprite' | 'tile'): string[] => slotsOf(surface).map((slot) => slot.id);

describe('K3 slot layout', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useToolPrefsStore.getState().resetLayout();
  });

  it('keeps the catalogue order without a saved layout', () => {
    const base = slotsOf('sprite');
    expect(arrangeSlots(base, undefined).map((slot) => slot.id)).toEqual(base.map((slot) => slot.id));
  });

  it('moves a slot before another one in the same group', () => {
    const slots = slotsOf('sprite');
    const draw = slots.filter((slot) => slot.group === slots[0]?.group);
    const last = draw[draw.length - 1];
    const first = draw[0];
    if (!last || !first || last === first) throw new Error('need two slots in a group');
    const layout = moveSlot(slots, { id: last.id, group: first.group, before: first.id });
    expect(arrangeSlots(slots, layout).map((slot) => slot.id).indexOf(last.id)).toBe(0);
  });

  it('moves a slot to the end of another group and changes its group', () => {
    const slots = slotsOf('sprite');
    const mover = slots[0];
    const target = slots.find((slot) => slot.group !== mover?.group);
    if (!mover || !target) throw new Error('need two groups');
    const layout = moveSlot(slots, { id: mover.id, group: target.group, before: null });
    const placed = arrangeSlots(slots, layout);
    expect(placed.find((slot) => slot.id === mover.id)?.group).toBe(target.group);
    const same = placed.filter((slot) => slot.group === target.group);
    expect(same[same.length - 1]?.id).toBe(mover.id);
  });

  it('steps a slot down and back up', () => {
    const slots = slotsOf('sprite');
    const first = slots[0];
    if (!first) throw new Error('no slot');
    const down = stepSlot(slots, first.id, 1);
    expect(down).not.toBeNull();
    expect(stepSlot(slots, first.id, -1)).toBeNull();
  });
});

describe('K3 saved slot layout', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useToolPrefsStore.getState().resetLayout();
  });

  it('reads the saved layout from slotsOf and drops it on reset', () => {
    const before = idsOf('sprite');
    const slots = slotsOf('sprite');
    const first = slots[0];
    const second = slots.find((slot) => slot.group === first?.group && slot !== first);
    if (!first || !second) throw new Error('need two slots in a group');
    useToolPrefsStore.getState().placeSlots('sprite', moveSlot(slots, { id: second.id, group: first.group, before: first.id }));
    expect(idsOf('sprite')[0]).toBe(second.id);
    useToolPrefsStore.getState().resetSurface('sprite', []);
    expect(idsOf('sprite')).toEqual(before);
  });

  it('leaves other surfaces alone on a per surface reset', () => {
    const slots = slotsOf('tile');
    const first = slots[0];
    if (!first) throw new Error('no slot');
    useToolPrefsStore.getState().placeSlots('tile', moveSlot(slots, { id: first.id, group: first.group, before: null }));
    useToolPrefsStore.getState().resetSurface('sprite', []);
    expect(useToolPrefsStore.getState().layouts.tile).toBeDefined();
  });

  it('un-hides the members of the surface on reset', () => {
    const member = slotsOf('sprite').flatMap((slot) => slot.members)[0];
    if (!member) throw new Error('no member');
    useToolPrefsStore.getState().toggleHidden(member.id);
    useToolPrefsStore.getState().resetSurface('sprite', [member.id]);
    expect(useToolPrefsStore.getState().hiddenMembers).toEqual([]);
  });

  it('keeps a saved layout through parsePrefs and drops bad entries', () => {
    const parsed = parsePrefs({ layouts: { sprite: [{ id: 'a', group: 'draw' }, { id: 'b', group: 'nope' }, 4], bogus: [] } });
    expect(parsed.layouts).toEqual({ sprite: [{ id: 'a', group: 'draw' }] });
  });
});
