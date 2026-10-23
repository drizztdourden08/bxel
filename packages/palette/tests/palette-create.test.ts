/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { undoLast } from './import-helpers';
import { execute, makeRig, rejectionCode, snapshotProject, step, succeed } from './palette-engine';
import type { Rig } from './palette-engine';

const create = (rig: Rig, options: object) => execute(rig, [step('palette.create', options)]);

const codeOf = (rig: Rig, options: object): string | null => rejectionCode(rig, () => create(rig, options));

const base = { name: 'Made', cap: 16, transparent: true, colors: ['#FF0000', '#00ff00'] };

describe('palette.create', () => {
  it('makes a transparent bank with lowercase colours and names the ref', () => {
    const rig = makeRig();
    const revision = rig.engine.state().revision;
    const result = succeed(execute(rig, [{ ...step('palette.create', base), ref: 'made' }]));
    const { banks } = rig.engine.state().project;
    const made = banks[1];
    expect(banks).toHaveLength(2);
    expect(made?.slots.map((slot) => (slot.kind === 'color' ? slot.rgb : slot.kind))).toEqual(['transparent', '#ff0000', '#00ff00']);
    expect(made?.slots.map((slot) => (slot.kind === 'color' ? slot.name : null))).toEqual([null, '#ff0000', '#00ff00']);
    expect([made?.name, made?.cap, made?.transparent]).toEqual(['Made', 16, true]);
    expect(result.ok && result.created.made).toBe(made?.id);
    expect(rig.engine.state().revision).toBe(revision + 1);
  });

  it('labels slot 0 of an opaque bank Background', () => {
    const rig = makeRig();
    succeed(create(rig, { ...base, transparent: false }));
    const made = rig.engine.state().project.banks[1];
    expect(made?.slots.map((slot) => (slot.kind === 'color' ? slot.name : null))).toEqual(['Background', '#00ff00']);
  });

  it('accepts a bank that exactly fills its cap', () => {
    const rig = makeRig();
    succeed(create(rig, { ...base, cap: 3 }));
    expect(rig.engine.state().project.banks[1]?.slots).toHaveLength(3);
  });

  it('warns about a repeated colour and keeps it', () => {
    const rig = makeRig();
    const result = succeed(create(rig, { ...base, colors: ['#ff0000', '#FF0000'] }));
    expect(result.ok && result.warnings.map((warning) => warning.code)).toEqual(['DUPLICATE_COLOR']);
  });

  it('undoes as one step', () => {
    const rig = makeRig();
    const snapshot = snapshotProject(rig.engine.state().project);
    succeed(create(rig, base));
    succeed(undoLast(rig));
    expect(snapshotProject(rig.engine.state().project)).toBe(snapshot);
  });

});

describe('palette.create rejections', () => {
  it('rejects a cap outside 1 to 256', () => {
    const rig = makeRig();
    expect(codeOf(rig, { ...base, cap: 0 })).toBe('CAP_OUT_OF_RANGE');
    expect(codeOf(rig, { ...base, cap: 257 })).toBe('CAP_OUT_OF_RANGE');
  });

  it('rejects colours that do not fit the cap, counting the transparent slot', () => {
    const rig = makeRig();
    expect(codeOf(rig, { ...base, cap: 2 })).toBe('PALETTE_FULL');
    expect(codeOf(rig, { ...base, transparent: false, cap: 1 })).toBe('PALETTE_FULL');
  });

  it('rejects a bad colour and an opaque bank with no colour', () => {
    const rig = makeRig();
    expect(codeOf(rig, { ...base, colors: ['red'] })).toBe('INVALID_COLOR');
    expect(codeOf(rig, { ...base, colors: ['#12345'] })).toBe('INVALID_COLOR');
    expect(codeOf(rig, { ...base, transparent: false, colors: [] })).toBe('INVALID_COLOR');
  });

  it('rejects an empty or too long name', () => {
    const rig = makeRig();
    expect(codeOf(rig, { ...base, name: '  ' })).toBe('NAME_INVALID');
    expect(codeOf(rig, { ...base, name: 'x'.repeat(65) })).toBe('NAME_INVALID');
  });

  it('rejects a misspelled option', () => {
    expect(codeOf(makeRig(), { ...base, transparency: true })).toBe('INVALID_OPTION');
  });
});
