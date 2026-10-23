/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { currentBank, execute, makeRig, rejectionCode, step, succeed } from './palette-engine';
import type { Rig } from './palette-engine';

const resize = (rig: Rig, cap: number) => execute(rig, [step('palette.resize', { bankId: rig.bankId, cap })]);

const codeOf = (rig: Rig, cap: number): string | null => rejectionCode(rig, () => resize(rig, cap));

describe('palette.resize', () => {
  it('grows the cap to 256', () => {
    const rig = makeRig();
    succeed(resize(rig, 256));
    expect(currentBank(rig).cap).toBe(256);
  });

  it('shrinks the cap down to exactly the slots in use', () => {
    const rig = makeRig();
    succeed(resize(rig, 5));
    expect(currentBank(rig).cap).toBe(5);
  });

  it('rejects a cap below the slots in use', () => {
    expect(codeOf(makeRig(), 4)).toBe('CAP_BELOW_USED');
  });

  it('rejects a cap outside 1 to 256', () => {
    const rig = makeRig();
    expect(codeOf(rig, 0)).toBe('CAP_OUT_OF_RANGE');
    expect(codeOf(rig, 257)).toBe('CAP_OUT_OF_RANGE');
    expect(codeOf(rig, -3)).toBe('CAP_OUT_OF_RANGE');
  });

  it('rejects a cap that is not a whole number', () => {
    expect(codeOf(makeRig(), 8.5)).toBe('INVALID_OPTION');
  });

  it('commits nothing when the cap does not change', () => {
    const rig = makeRig();
    const revision = rig.engine.state().revision;
    const result = succeed(resize(rig, 8));
    expect(result.ok && result.noop).toBe(true);
    expect(rig.engine.state().revision).toBe(revision);
  });
});
