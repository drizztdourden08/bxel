/* @layer renderer-app @kind test */
import { frameToRgba } from '@bxel/document';
import { buildRamp } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { movedOrder } from '../../src/palette-panel/moved-order';
import { sheetPlan } from '../../src/palette-panel/sheet-plan';
import { swappedOrder } from '../../src/palette-panel/swapped-order';
import { applyRamp } from '../../src/palette-ramps/apply-ramp';
import { membershipSteps } from '../../src/palette-ramps/membership-steps';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { openEditor } from '../editor/editor-harness';

const rig = () => {
  const editor = openEditor();
  useDocumentStore.setState({ host: editor.host });
  return editor;
};

describe('S2 palette panel actions', { tags: ['standard'] }, () => {
  it('moves a block of swatches into a gap and keeps slot 0 first', () => {
    const { target } = rig();
    const bank = target().bank;
    const ids = bank.slots.map((slot) => String(slot.id));
    expect(movedOrder(bank, [5], 7)).toEqual([...ids.slice(0, 5), ids[6], ids[5], ...ids.slice(7)]);
    expect(movedOrder(bank, [2, 3], 0)[0]).toBe(ids[0]);
    expect(swappedOrder(bank, 1, 2).slice(0, 3)).toEqual([ids[0], ids[2], ids[1]]);
  });

  it('plans Remove unused with the colours that go and the palette after', () => {
    const { host, documentId, target } = rig();
    const artwork = host.view(documentId)?.state.artwork;
    if (!artwork) throw new Error('no artwork');
    const plan = sheetPlan(artwork, target().bank, target().sprite, { kind: 'unused', documentId, bankId: target().bank.id, first: 0, last: 0 });
    expect(plan.after.length + plan.gone.length).toBe(target().bank.slots.length);
    expect(plan.steps.length).toBe(plan.gone.length === 0 ? 0 : 1);
  });

  it('adds a ramp and its new swatches as one undo step and keeps the drawing', () => {
    const { host, documentId, target } = rig();
    const bank = target().bank;
    const base = bank.slots[3];
    if (base?.kind !== 'color') throw new Error('slot 3 is not a colour');
    const looks = Array.from(frameToRgba(target().sprite, bank, target().frameId));
    const ramp = buildRamp({ base: base.rgb, baseIndex: 3, light: 1, dark: 1, hueShift: 15, hueMode: 'shift', chromaCurve: true, snap: 0, existing: [] });
    if (!ramp) throw new Error('no ramp');
    const free = bank.cap - bank.slots.length;
    const outcome = applyRamp(target(), ramp.steps, 'Moss');
    if (free < ramp.added) {
      expect(outcome.ok).toBe(false);
      return;
    }
    expect(outcome.ok).toBe(true);
    expect(target().bank.ramps.map((each) => each.name)).toContain('Moss');
    expect(Array.from(frameToRgba(target().sprite, target().bank, target().frameId))).toEqual(looks);
    host.undo(documentId);
    expect(target().bank.ramps).toHaveLength(0);
    expect(target().bank.slots).toHaveLength(bank.slots.length);
  });

  it('plans adding a swatch to a ramp as a copy and nothing when it is already there', () => {
    const { target } = rig();
    const bank = target().bank;
    const base = bank.slots[3];
    if (base?.kind !== 'color') throw new Error('slot 3 is not a colour');
    const ramp = buildRamp({ base: base.rgb, baseIndex: 3, light: 1, dark: 1, hueShift: 15, hueMode: 'shift', chromaCurve: true, snap: 0, existing: [] });
    if (!ramp || bank.cap - bank.slots.length < ramp.added || !applyRamp(target(), ramp.steps, 'Moss').ok) return;
    const made = target().bank;
    const moss = made.ramps.find((each) => each.name === 'Moss');
    const outside = made.slots.findIndex((slot, index) => index > 0 && moss !== undefined && !moss.swatches.includes(slot.id));
    if (!moss || outside < 0) return;
    expect(membershipSteps(made, { index: outside, from: null, to: moss.id, copy: true })).toHaveLength(1);
    const inside = made.slots.findIndex((slot) => moss.swatches.includes(slot.id));
    expect(membershipSteps(made, { index: inside, from: null, to: moss.id, copy: true })).toHaveLength(0);
  });
});
