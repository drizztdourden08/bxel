/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { artworkReport } from '../../src/platform-preset/artwork-report';
import { presetById } from '../../src/platform-preset/preset-by-id';
import { setStrict } from '../../src/platform-preset/set-strict';
import { snapPlan } from '../../src/platform-preset/snap-plan';
import { snapPlatform } from '../../src/platform-preset/snap-platform';
import { artworkOf, chosen, platformFile, revisionOf, run } from './platform-harness';
import type { PlatformFile } from './platform-harness';

const recolour = (file: PlatformFile, at: { bank: number; slot: number }, change: { rgb: string; name?: string }): void => {
  const bank = artworkOf(file).banks[at.bank];
  const options = { bankId: bank?.id, swatchId: bank?.slots[at.slot]?.id, ...change };
  expect(run(file, COMMAND_NAME.swatchUpdate, options).ok).toBe(true);
};

const rgbAt = (file: PlatformFile, bankAt: number, slot: number): string => {
  const swatch = artworkOf(file).banks[bankAt]?.slots[slot];
  return swatch?.kind === 'color' ? swatch.rgb : '';
};

const nameAt = (file: PlatformFile, bankAt: number, slot: number): string => {
  const swatch = artworkOf(file).banks[bankAt]?.slots[slot];
  return swatch?.kind === 'color' ? swatch.name : '';
};

const offGrid = (): PlatformFile => {
  const file = platformFile(chosen('snes-sprite'));
  recolour(file, { bank: 0, slot: 1 }, { rgb: '#010203', name: 'Skin' });
  recolour(file, { bank: 0, slot: 2 }, { rgb: '#fe0000', name: '#fe0000' });
  recolour(file, { bank: 1, slot: 3 }, { rgb: '#102031' });
  return file;
};

const planOf = (file: PlatformFile) => {
  const preset = presetById('snes-sprite');
  if (!preset) throw new Error('no preset');
  return snapPlan(artworkOf(file), preset);
};

describe('the snap plan', () => {
  it('lists the before and after colour of every swatch that moves, in every palette', () => {
    const { changes, skipped } = planOf(offGrid());
    expect(skipped).toEqual([]);
    expect(changes.map((change) => [change.index, change.before])).toEqual([
      [1, '#010203'],
      [2, '#fe0000'],
      [3, '#102031'],
    ]);
    expect(changes[0]?.after).toBe('#000000');
    expect(changes[1]?.after).toBe('#ff0000');
    expect(changes.every((change) => /^#[0-9a-f]{6}$/.test(change.after) && change.after !== change.before)).toBe(true);
  });

  it('is empty for a file that is already on the grid', () => {
    expect(planOf(platformFile(chosen('snes-sprite'))).changes).toEqual([]);
  });
});

describe('Snap palette to platform', () => {
  it('moves every colour onto the grid as one undo step', () => {
    const file = offGrid();
    const before = revisionOf(file);
    const outcome = snapPlatform(file.host, file.documentId);
    expect(outcome).toEqual({ ok: true, moved: 3 });
    expect(revisionOf(file)).toBe(before + 1);
    expect(rgbAt(file, 0, 1)).toBe('#000000');
    expect(rgbAt(file, 0, 2)).toBe('#ff0000');
    expect(artworkReport(artworkOf(file))?.findings).toEqual([]);
    file.host.undo(file.documentId);
    expect([rgbAt(file, 0, 1), rgbAt(file, 0, 2), rgbAt(file, 1, 3)]).toEqual(['#010203', '#fe0000', '#102031']);
    file.host.redo(file.documentId);
    expect(rgbAt(file, 0, 1)).toBe('#000000');
  });

  it('keeps a name the user gave and renames a swatch that was named after its colour', () => {
    const file = offGrid();
    snapPlatform(file.host, file.documentId);
    expect(nameAt(file, 0, 1)).toBe('Skin');
    expect(nameAt(file, 0, 2)).toBe('#ff0000');
  });

  it('says so when nothing needs to move or there is no platform', () => {
    const file = platformFile(chosen('snes-sprite'));
    expect(snapPlatform(file.host, file.documentId)).toEqual({ ok: false, message: 'Every colour is already on the platform grid.' });
    const free = platformFile({ ...chosen('snes-sprite'), platformId: null });
    expect(snapPlatform(free.host, free.documentId)).toEqual({ ok: false, message: 'Choose a platform first.' });
  });

  it('is allowed on a strict file because it only fixes breaks', () => {
    const file = offGrid();
    expect(setStrict(file.host, file.documentId, true)).toEqual({ ok: true });
    expect(snapPlatform(file.host, file.documentId)).toEqual({ ok: true, moved: 3 });
  });
});
