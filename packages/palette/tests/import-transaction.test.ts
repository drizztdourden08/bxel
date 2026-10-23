/* @layer tests @kind test */
import { extractPalette } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { firstCelPixels, importOptions, importStep, redoLast, spriteNamed, undoLast } from './import-helpers';
import { makeNoiseImage } from './make-noise-image';
import { execute, makeRig, snapshotProject, step, succeed } from './palette-engine';
import type { Rig } from './palette-engine';

const photo = makeNoiseImage(24, 11);
const colors = extractPalette(photo, { maxColors: 7 });

const bankStep = () => ({
  ...step('palette.create', { name: 'Extracted', cap: colors.length + 1, transparent: true, colors }),
  ref: 'bank',
});

const loadStep = (options: object) => ({ ...importStep(options), ref: 'photo' });

const extractAndImport = (name: string) => [bankStep(), loadStep(importOptions(name, photo, { ref: 'bank' }))];

const request = (rig: Rig, mode: 'preview' | 'commit', baseRevision: number) => ({
  documentId: rig.engine.documentId,
  baseRevision,
  mode,
  origin: 'ui' as const,
  label: 'Import',
  steps: extractAndImport('photo'),
  previewPixels: 1_000_000,
});

describe('extract the best colours, then import', () => {
  it('is one transaction: a new bank and a sprite mapped only to it', () => {
    const rig = makeRig();
    const revision = rig.engine.state().revision;
    const result = succeed(execute(rig, extractAndImport('photo')));
    const { project } = rig.engine.state();
    const bank = project.banks[1];
    const sprite = spriteNamed(rig, 'photo');
    expect(colors.length).toBeGreaterThan(1);
    expect(project.banks).toHaveLength(2);
    expect(bank?.slots).toHaveLength(colors.length + 1);
    expect(bank?.slots[0]?.kind).toBe('transparent');
    expect(sprite.bankId).toBe(bank?.id);
    expect(result.ok && [result.created.bank, result.created.photo]).toEqual([bank?.id, sprite.id]);
    expect(firstCelPixels(sprite).every((index) => index >= 1 && index <= colors.length)).toBe(true);
    expect(rig.engine.state().revision).toBe(revision + 1);
  });

  it('undoes both the bank and the sprite in one step, and redo brings both back', () => {
    const rig = makeRig();
    const before = snapshotProject(rig.engine.state().project);
    succeed(execute(rig, extractAndImport('photo')));
    const after = snapshotProject(rig.engine.state().project);
    succeed(undoLast(rig));
    expect(snapshotProject(rig.engine.state().project)).toBe(before);
    expect(rig.engine.state().project.banks).toHaveLength(1);
    expect(rig.engine.state().project.sprites).toHaveLength(1);
    succeed(redoLast(rig));
    expect(snapshotProject(rig.engine.state().project)).toBe(after);
  });

  it('adds nothing when the image is too large, not even the bank', () => {
    const rig = makeRig();
    const before = snapshotProject(rig.engine.state().project);
    const revision = rig.engine.state().revision;
    const oversize = { width: 2049, height: 1, rgba: new Uint8Array(2049 * 4) };
    const result = execute(rig, [bankStep(), loadStep({ ...importOptions('photo', photo, { ref: 'bank' }), image: oversize })]);
    expect(result.ok ? null : [result.error.code, result.error.step]).toEqual(['SIZE_OUT_OF_RANGE', 1]);
    expect(snapshotProject(rig.engine.state().project)).toBe(before);
    expect(rig.engine.state().revision).toBe(revision);
  });

  it('fails the whole transaction when the bank is made after the import', () => {
    const rig = makeRig();
    const before = snapshotProject(rig.engine.state().project);
    const result = execute(rig, [loadStep(importOptions('photo', photo, { ref: 'bank' })), bankStep()]);
    expect(result.ok ? null : [result.error.code, result.error.step]).toEqual(['TARGET_NOT_FOUND', 0]);
    expect(snapshotProject(rig.engine.state().project)).toBe(before);
  });
});

describe('preview and revisions', () => {
  it('preview shows the committed pixels and changes nothing', () => {
    const rig = makeRig();
    const revision = rig.engine.state().revision;
    const before = snapshotProject(rig.engine.state().project);
    const preview = succeed(rig.engine.execute(request(rig, 'preview', revision)));
    expect(snapshotProject(rig.engine.state().project)).toBe(before);
    expect(rig.engine.state().revision).toBe(revision);
    const commit = succeed(rig.engine.execute(request(rig, 'commit', revision)));
    const shown = preview.ok ? preview.preview?.cels[0]?.pixels : undefined;
    expect(shown).toEqual(firstCelPixels(spriteNamed(rig, 'photo')));
    expect(preview.ok ? preview.created : null).toEqual(commit.ok ? commit.created : null);
  });

  it('a stale base revision changes nothing', () => {
    const rig = makeRig();
    const stale = rig.engine.state().revision - 1;
    const before = snapshotProject(rig.engine.state().project);
    const result = rig.engine.execute(request(rig, 'commit', stale));
    expect(result.ok ? null : result.error.code).toBe('STALE_REVISION');
    expect(snapshotProject(rig.engine.state().project)).toBe(before);
  });
});
