/* @layer tests @kind test */
import type { SpriteId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { createBank } from './import-helpers';
import { currentBank, execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';
import { addSprite, bankOf, flatIndices, onSprites, previewMatchesCommit, rgbaOfSprite, roundTrip, spriteOf } from './palette-rig';

const detach = (spriteId: SpriteId, options: object = {}) => onSprites(step('palette.detach', options), [spriteId]);

const sharedRig = () => {
  const rig = makeRig();
  const second = addSprite(rig, 'second', rig.bankId, [1, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 1, 2, 2, 3, 3]);
  return { rig, second };
};

describe('palette.delete', () => {
  it('removes a bank no sprite uses and undoes exactly', () => {
    const rig = makeRig();
    const bankId = createBank(rig, ['#112233', '#445566'], true);
    roundTrip(rig, [step('palette.delete', { bankId })]);
    expect(rig.engine.state().artwork.banks.map((bank) => bank.id)).toEqual([rig.bankId]);
  });

  it('refuses the default bank, a bank in use and an unknown bank', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [step('palette.delete', { bankId: rig.bankId })]))).toBe('DEFAULT_BANK');
    const bankId = createBank(rig, ['#112233', '#445566'], true);
    const second = addSprite(rig, 'second', bankId, new Array<number>(16).fill(1));
    const used = step('palette.delete', { bankId });
    expect(rejectionCode(rig, () => execute(rig, [used]))).toBe('BANK_IN_USE');
    const failed = execute(rig, [used]);
    expect(failed.ok ? [] : failed.error.details.map((issue) => issue.spriteId)).toEqual([second]);
    expect(rejectionCode(rig, () => execute(rig, [step('palette.delete', { bankId: 'bnk_zzzzzz' })]))).toBe('TARGET_NOT_FOUND');
  });

  it('refuses a bank an animation uses, even when no sprite does', () => {
    const rig = makeRig();
    const bankId = createBank(rig, ['#112233', '#445566'], true);
    succeed(execute(rig, [step('animation.create', { name: 'idle', source: { kind: 'blank', width: 2, height: 2, bankId } })]));
    const failed = execute(rig, [step('palette.delete', { bankId })]);
    expect(failed.ok ? null : failed.error.code).toBe('BANK_IN_USE');
    expect(failed.ok ? '' : failed.error.message).toContain('animation');
  });
});

describe('palette.detach', () => {
  it('gives one sprite its own copy with the same indices and colours', () => {
    const { rig, second } = sharedRig();
    succeed(execute(rig, [step('ramp.add', { bankId: rig.bankId, name: 'Violets', swatches: [slotId(rig, 1), slotId(rig, 3)] })]));
    const source = currentBank(rig);
    const flat = flatIndices(rig, second);
    const rgba = rgbaOfSprite(rig, second);
    const result = roundTrip(rig, [{ ...detach(second), ref: 'own' }]);
    const copy = bankOf(rig, result.created.own as never);
    expect(spriteOf(rig, second).bankId).toBe(copy.id);
    expect(spriteOf(rig, rig.spriteId).bankId).toBe(rig.bankId);
    expect(copy.name).toBe('Test bank copy');
    expect(copy.slots.map((slot) => slot.kind)).toEqual(source.slots.map((slot) => slot.kind));
    expect(copy.slots.every((slot, at) => slot.id !== source.slots[at]?.id)).toBe(true);
    expect(copy.slots.map((slot) => (slot.kind === 'color' ? slot.rgb : null))).toEqual(
      source.slots.map((slot) => (slot.kind === 'color' ? slot.rgb : null)),
    );
    expect(copy.ramps[0]?.swatches).toEqual([copy.slots[1]?.id, copy.slots[3]?.id]);
    expect(copy.ramps[0]?.id).not.toBe(source.ramps[0]?.id);
    expect(bankOf(rig, rig.bankId)).toEqual(source);
    expect(flatIndices(rig, second)).toEqual(flat);
    expect(rgbaOfSprite(rig, second)).toEqual(rgba);
  });

  it('numbers the copy name when the first copy exists', () => {
    const { rig, second } = sharedRig();
    const third = addSprite(rig, 'third', rig.bankId, new Array<number>(16).fill(2));
    succeed(execute(rig, [detach(second)]));
    succeed(execute(rig, [detach(third)]));
    expect(rig.engine.state().artwork.banks.map((bank) => bank.name)).toEqual(['Test bank', 'Test bank copy', 'Test bank copy 2']);
  });

  it('takes an explicit name and rejects one already taken', () => {
    const { rig, second } = sharedRig();
    expect(rejectionCode(rig, () => execute(rig, [detach(second, { name: 'TEST BANK' })]))).toBe('NAME_TAKEN');
    succeed(execute(rig, [detach(second, { name: 'Mine' })]));
    expect(rig.engine.state().artwork.banks.map((bank) => bank.name)).toEqual(['Test bank', 'Mine']);
  });

  it('refuses a sprite that already has its own palette', () => {
    const rig = makeRig();
    const result = execute(rig, [detach(rig.spriteId)]);
    expect(result.ok ? null : result.error.code).toBe('INCOMPATIBLE_TARGETS');
    expect(rejectionCode(rig, () => execute(rig, [detach(rig.spriteId)]))).toBe('INCOMPATIBLE_TARGETS');
  });

  it('previews exactly what it commits', () => {
    const { rig, second } = sharedRig();
    previewMatchesCommit(rig, [{ ...detach(second), ref: 'own' }]);
  });
});
