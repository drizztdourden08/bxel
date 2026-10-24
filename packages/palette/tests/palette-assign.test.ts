/* @layer tests @kind test */
import type { BankId, SpriteId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { createBank } from './import-helpers';
import { currentSprite, execute, makeRig, rejectionCode, slotId, step } from './palette-engine';
import { addSprite, bankOf, flatIndices, onSprites, previewMatchesCommit, roundTrip, spriteOf } from './palette-rig';
import type { Rig } from './palette-engine';

const destColors = ['#b12b9d', '#150c27', '#7c40e5', '#4c20a1'];
const nearest = [0, 2, 4, 3, 1];

const assign = (sprites: readonly SpriteId[], options: object) => onSprites(step('palette.assign', options), sprites);

const destId = (rig: Rig): BankId => createBank(rig, destColors, true);

describe('palette.assign', () => {
  it('moves a sprite to another bank by nearest colour in one undo', () => {
    const rig = makeRig();
    const dest = destId(rig);
    const flat = flatIndices(rig, rig.spriteId);
    roundTrip(rig, [assign([rig.spriteId], { bankId: dest })]);
    expect(currentSprite(rig).bankId).toBe(dest);
    expect(flatIndices(rig, rig.spriteId)).toEqual(flat.map((value) => nearest[value]));
  });

  it('leaves other sprites of the source bank where they are', () => {
    const rig = makeRig();
    const second = addSprite(rig, 'second', rig.bankId, new Array<number>(16).fill(2));
    const dest = destId(rig);
    roundTrip(rig, [assign([second], { bankId: dest })]);
    expect(spriteOf(rig, second).bankId).toBe(dest);
    expect(currentSprite(rig).bankId).toBe(rig.bankId);
    expect(flatIndices(rig, second)).toEqual(new Array<number>(16).fill(4));
  });

  it('lets an explicit table override the nearest colour', () => {
    const rig = makeRig();
    const dest = destId(rig);
    const flat = flatIndices(rig, rig.spriteId);
    const bank = bankOf(rig, dest);
    const mapping = [
      { from: slotId(rig, 1), to: bank.slots[4]?.id },
      { from: slotId(rig, 3), to: bank.slots[0]?.id },
    ];
    roundTrip(rig, [assign([rig.spriteId], { bankId: dest, mapping })]);
    const table = [0, 4, 4, 0, 1];
    expect(flatIndices(rig, rig.spriteId)).toEqual(flat.map((value) => table[value]));
  });

  it('maps sprites from different banks in one step', () => {
    const rig = makeRig();
    const other = createBank(rig, ['#112233', '#ff0000'], false);
    const second = addSprite(rig, 'second', other, [0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1]);
    const dest = destId(rig);
    roundTrip(rig, [assign([rig.spriteId, second], { bankId: dest })]);
    expect([spriteOf(rig, second).bankId, currentSprite(rig).bankId]).toEqual([dest, dest]);
    expect(Math.max(...flatIndices(rig, second))).toBeLessThan(bankOf(rig, dest).slots.length);
  });

  it('rejects bad targets and tables without a change', () => {
    const rig = makeRig();
    const dest = destId(rig);
    const bank = bankOf(rig, dest);
    const run = (options: object) => rejectionCode(rig, () => execute(rig, [assign([rig.spriteId], options)]));
    expect(run({ bankId: rig.bankId })).toBe('INCOMPATIBLE_TARGETS');
    expect(run({ bankId: 'bnk_zzzzzz' })).toBe('TARGET_NOT_FOUND');
    expect(run({ bankId: dest, mapping: [{ from: slotId(rig, 0), to: bank.slots[1]?.id }] })).toBe('INVALID_OPTION');
    expect(run({ bankId: dest, mapping: [{ from: 'sw_zzzzzz', to: bank.slots[1]?.id }] })).toBe('TARGET_NOT_FOUND');
    expect(run({ bankId: dest, mapping: [{ from: slotId(rig, 1), to: slotId(rig, 2) }] })).toBe('TARGET_NOT_FOUND');
    const twice = { from: slotId(rig, 1), to: bank.slots[1]?.id };
    expect(run({ bankId: dest, mapping: [twice, twice] })).toBe('INVALID_OPTION');
    expect(run({ bankId: createBank(rig, [], true) })).toBe('INVALID_OPTION');
  });

  it('previews exactly what it commits', () => {
    const rig = makeRig();
    previewMatchesCommit(rig, [assign([rig.spriteId], { bankId: destId(rig) })]);
  });
});
