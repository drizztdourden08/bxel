/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { arrangeSlots } from '../../src/editor/tool-catalogue/arrange-slots';
import { moveMember } from '../../src/editor/tool-catalogue/move-member';
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

  it('keeps the member list of a slot through parsePrefs', () => {
    const parsed = parsePrefs({ layouts: { sprite: [{ id: 'a', group: 'draw', members: ['x', 4, 'y'] }, { id: 'b', group: 'draw', members: [] }] } });
    expect(parsed.layouts).toEqual({ sprite: [{ id: 'a', group: 'draw', members: ['x', 'y'] }, { id: 'b', group: 'draw' }] });
  });
});

const crowded = () => {
  const slots = slotsOf('sprite');
  const from = slots.find((slot) => slot.members.length > 1);
  const to = slots.find((slot) => slot !== from);
  const member = from?.members[from.members.length - 1];
  if (!from || !to || !member) throw new Error('need a slot with two members and another slot');
  return { slots, from, to, member };
};

describe('K3 moving a member between slots', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useToolPrefsStore.getState().resetLayout();
  });

  it('joins the member to another slot and takes it from its old one', () => {
    const { slots, from, to, member } = crowded();
    useToolPrefsStore.getState().placeSlots('sprite', moveMember(slots, { member: member.id, to: to.id }));
    const after = slotsOf('sprite');
    expect(after.find((slot) => slot.id === to.id)?.members.map((each) => each.id)).toEqual([...to.members.map((each) => each.id), member.id]);
    expect(after.find((slot) => slot.id === from.id)?.members.some((each) => each.id === member.id)).toBe(false);
  });

  it('gives the member a slot of its own right after the old slot', () => {
    const { slots, from, member } = crowded();
    useToolPrefsStore.getState().placeSlots('sprite', moveMember(slots, { member: member.id, to: null }));
    const after = slotsOf('sprite');
    const alone = after.find((slot) => slot.members.length === 1 && slot.members[0]?.id === member.id);
    expect(alone).toBeDefined();
    expect(alone?.group).toBe(from.group);
    expect(after.findIndex((slot) => slot.id === alone?.id)).toBe(after.findIndex((slot) => slot.id === from.id) + 1);
    expect(after).toHaveLength(slots.length + 1);
  });

  it('drops a slot that lost its last member and saves nothing once the member is back', () => {
    const slots = slotsOf('sprite');
    const lonely = slots.find((slot) => slot.members.length === 1 && slot.members[0]?.id === slot.id);
    const target = slots.find((slot) => slot.id !== lonely?.id && slot.group === lonely?.group);
    if (!lonely || !target) throw new Error('need a one member slot and a neighbour');
    useToolPrefsStore.getState().placeSlots('sprite', moveMember(slots, { member: lonely.id, to: target.id }));
    expect(slotsOf('sprite').some((slot) => slot.id === lonely.id)).toBe(false);
    const back = moveMember(slotsOf('sprite'), { member: lonely.id, to: null });
    useToolPrefsStore.getState().placeSlots('sprite', back);
    expect(slotsOf('sprite').map((slot) => slot.id).sort()).toEqual(slots.map((slot) => slot.id).sort());
    expect(slotsOf('sprite').find((slot) => slot.id === lonely.id)?.members).toHaveLength(1);
    expect(back.find((place) => place.id === target.id)?.members).toBeUndefined();
  });

  it('ignores a move to the slot that already holds the member and an unknown member', () => {
    const { slots, from, member } = crowded();
    expect(moveMember(slots, { member: member.id, to: from.id }).every((place) => place.members === undefined)).toBe(true);
    expect(moveMember(slots, { member: 'nope', to: null }).map((place) => place.id)).toEqual(slots.map((slot) => slot.id));
  });
});
