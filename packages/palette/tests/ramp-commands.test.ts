/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';
import { bankOf, previewMatchesCommit, roundTrip } from './palette-rig';
import type { Rig } from './palette-engine';

const ids = (rig: Rig, indices: readonly number[]): string[] => indices.map((index) => slotId(rig, index));

const addRamp = (rig: Rig, name: string, indices: readonly number[]) =>
  step('ramp.add', { bankId: rig.bankId, name, swatches: ids(rig, indices) });

const rampsOf = (rig: Rig) => bankOf(rig, rig.bankId).ramps;

describe('ramp.add', () => {
  it('appends a ramp, registers its ref and undoes exactly', () => {
    const rig = makeRig();
    const result = roundTrip(rig, [{ ...addRamp(rig, 'Violets', [1, 2, 3]), ref: 'violets' }]);
    expect(rampsOf(rig)).toHaveLength(1);
    expect(rampsOf(rig)[0]?.swatches).toEqual(ids(rig, [1, 2, 3]));
    expect(result.created.violets).toBe(rampsOf(rig)[0]?.id);
  });

  it('rejects duplicate names without regard to case', () => {
    const rig = makeRig();
    succeed(execute(rig, [addRamp(rig, 'Violets', [1, 2])]));
    expect(rejectionCode(rig, () => execute(rig, [addRamp(rig, ' violets ', [2, 3])]))).toBe('NAME_TAKEN');
  });

  it('rejects bad swatch lists and names', () => {
    const rig = makeRig();
    expect(rejectionCode(rig, () => execute(rig, [addRamp(rig, 'One', [1])]))).toBe('INVALID_OPTION');
    expect(rejectionCode(rig, () => execute(rig, [addRamp(rig, 'Twice', [1, 1])]))).toBe('INVALID_OPTION');
    expect(rejectionCode(rig, () => execute(rig, [addRamp(rig, 'Clear', [0, 1])]))).toBe('INVALID_OPTION');
    expect(rejectionCode(rig, () => execute(rig, [addRamp(rig, '   ', [1, 2])]))).toBe('NAME_INVALID');
    const ghost = [slotId(rig, 1), 'sw_zzzzzz'];
    expect(rejectionCode(rig, () => execute(rig, [step('ramp.add', { bankId: rig.bankId, name: 'Ghost', swatches: ghost })]))).toBe(
      'TARGET_NOT_FOUND',
    );
  });

  it('previews exactly what it commits', () => {
    const rig = makeRig();
    previewMatchesCommit(rig, [{ ...addRamp(rig, 'Violets', [1, 2, 3]), ref: 'made' }]);
  });
});

describe('ramp.update', () => {
  it('renames a ramp and replaces its swatches', () => {
    const rig = makeRig();
    succeed(execute(rig, [addRamp(rig, 'Violets', [1, 2])]));
    const rampId = rampsOf(rig)[0]?.id ?? '';
    roundTrip(rig, [step('ramp.update', { bankId: rig.bankId, rampId, name: 'Night', swatches: ids(rig, [4, 3, 2]) })]);
    expect(rampsOf(rig)[0]).toEqual({ id: rampId, name: 'Night', swatches: ids(rig, [4, 3, 2]) });
  });

  it('allows keeping its own name and rejects another ramp name', () => {
    const rig = makeRig();
    succeed(execute(rig, [addRamp(rig, 'Violets', [1, 2]), addRamp(rig, 'Pinks', [3, 4])]));
    const [first, second] = rampsOf(rig);
    const keep = step('ramp.update', { bankId: rig.bankId, rampId: first?.id, name: 'VIOLETS', swatches: ids(rig, [2, 3]) });
    succeed(execute(rig, [keep]));
    const clash = step('ramp.update', { bankId: rig.bankId, rampId: second?.id, name: 'violets' });
    expect(rejectionCode(rig, () => execute(rig, [clash]))).toBe('NAME_TAKEN');
  });

  it('rejects an unknown ramp and commits nothing for an unchanged ramp', () => {
    const rig = makeRig();
    succeed(execute(rig, [addRamp(rig, 'Violets', [1, 2])]));
    const missing = step('ramp.update', { bankId: rig.bankId, rampId: 'rmp_zzzzzz', name: 'X' });
    expect(rejectionCode(rig, () => execute(rig, [missing]))).toBe('TARGET_NOT_FOUND');
    const same = step('ramp.update', { bankId: rig.bankId, rampId: rampsOf(rig)[0]?.id, name: 'Violets' });
    const result = succeed(execute(rig, [same]));
    expect(result.ok && result.noop).toBe(true);
  });
});

describe('ramp.delete', () => {
  it('removes a ramp and undoes exactly', () => {
    const rig = makeRig();
    succeed(execute(rig, [addRamp(rig, 'Violets', [1, 2])]));
    const rampId = rampsOf(rig)[0]?.id ?? '';
    roundTrip(rig, [step('ramp.delete', { bankId: rig.bankId, rampId })]);
    expect(rampsOf(rig)).toHaveLength(0);
  });

  it('rejects an unknown ramp', () => {
    const rig = makeRig();
    const missing = step('ramp.delete', { bankId: rig.bankId, rampId: 'rmp_zzzzzz' });
    expect(rejectionCode(rig, () => execute(rig, [missing]))).toBe('TARGET_NOT_FOUND');
  });
});
