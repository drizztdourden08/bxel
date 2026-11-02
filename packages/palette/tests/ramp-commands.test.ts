/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { execute, makeRig, rejectionCode, slotId, step, succeed } from './palette-engine';
import { bankOf, previewMatchesCommit, roundTrip } from './palette-rig';
import type { Rig } from './palette-engine';

const ids = (rig: Rig, indices: readonly number[]): string[] => indices.map((index) => slotId(rig, index));

const addRamp = (rig: Rig, name: string, indices: readonly number[]) =>
  step('ramp.add', { bankId: rig.bankId, name, swatches: ids(rig, indices) });

const rampsOf = (rig: Rig) => bankOf(rig, rig.bankId).ramps;

describe('K2 ramp.add', { tags: ['critical'] }, () => {
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

describe('K2 ramp.update', { tags: ['critical'] }, () => {
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

describe('K2 ramp.delete', { tags: ['critical'] }, () => {
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

describe('K2 ramp.move', { tags: ['critical'] }, () => {
  const names = (rig: Rig): string[] => rampsOf(rig).map((ramp) => ramp.name);
  const three = (): Rig => {
    const rig = makeRig();
    succeed(execute(rig, [addRamp(rig, 'A', [1, 2]), addRamp(rig, 'B', [2, 3]), addRamp(rig, 'C', [3, 4])]));
    return rig;
  };

  it('moves a ramp down and up and undoes exactly', () => {
    const rig = three();
    const first = rampsOf(rig)[0]?.id ?? '';
    roundTrip(rig, [step('ramp.move', { bankId: rig.bankId, rampId: first, toIndex: 2 })]);
    expect(names(rig)).toEqual(['B', 'C', 'A']);
    const last = rampsOf(rig)[2]?.id ?? '';
    roundTrip(rig, [step('ramp.move', { bankId: rig.bankId, rampId: last, toIndex: 0 })]);
    expect(names(rig)).toEqual(['A', 'B', 'C']);
  });

  it('does nothing when the ramp is already there', () => {
    const rig = three();
    const second = rampsOf(rig)[1]?.id ?? '';
    succeed(execute(rig, [step('ramp.move', { bankId: rig.bankId, rampId: second, toIndex: 1 })]));
    expect(names(rig)).toEqual(['A', 'B', 'C']);
  });

  it('rejects an unknown ramp and an index past the end', () => {
    const rig = three();
    const missing = step('ramp.move', { bankId: rig.bankId, rampId: 'rmp_zzzzzz', toIndex: 0 });
    expect(rejectionCode(rig, () => execute(rig, [missing]))).toBe('TARGET_NOT_FOUND');
    const far = step('ramp.move', { bankId: rig.bankId, rampId: rampsOf(rig)[0]?.id, toIndex: 3 });
    expect(rejectionCode(rig, () => execute(rig, [far]))).toBe('INVALID_OPTION');
  });

  it('previews exactly what it commits', () => {
    const rig = three();
    previewMatchesCommit(rig, [step('ramp.move', { bankId: rig.bankId, rampId: rampsOf(rig)[0]?.id, toIndex: 1 })]);
  });
});
