/* @layer renderer-app @kind test */
import { COMMAND_NAME, flattenFrame } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { newFormErrors } from '../../src/new-sprite/new-form-errors';
import { newSummary } from '../../src/new-sprite/new-summary';
import { patchForm } from '../../src/new-sprite/patch-form';
import { bankOptions } from '../../src/palette-bank/bank-options';
import { switchBank } from '../../src/palette-bank/switch-bank';
import { artworkOf, blank, chosen, platformFile, revisionOf, run, spriteScope } from './platform-harness';
import type { PlatformFile } from './platform-harness';

const spriteIndices = (file: PlatformFile): number[] => {
  const sprite = artworkOf(file).sprites[0];
  const frame = sprite?.frames[0];
  return sprite && frame ? [...flattenFrame(sprite, frame.id)] : [];
};

const paintIndex = (file: PlatformFile, index: number): void => {
  const sprite = artworkOf(file).sprites[0];
  const pixels = new Uint8Array(sprite ? sprite.width * sprite.height : 0).fill(index);
  const rect = { x: 0, y: 0, width: sprite?.width ?? 1, height: sprite?.height ?? 1 };
  expect(run(file, COMMAND_NAME.pixelsPatch, { rect, pixels }, spriteScope(sprite?.id ?? '')).ok).toBe(true);
};

describe('the palettes a new file starts with', () => {
  it('follows the platform: one palette on a flat target and the whole set on a banked one', () => {
    expect(chosen('snes-sprite').banks).toBe(8);
    expect(chosen('nes-sprite').banks).toBe(4);
    expect(chosen('pico-8').banks).toBe(1);
    expect(blank().banks).toBe(1);
  });

  it('creates every palette in the file, each with the same slots and colours', () => {
    const file = platformFile(chosen('snes-sprite'));
    const banks = artworkOf(file).banks;
    expect(banks).toHaveLength(8);
    expect(new Set(banks.map((bank) => bank.name)).size).toBe(8);
    expect(banks.every((bank) => bank.cap === 16 && bank.transparent && bank.slots.length === 16)).toBe(true);
    expect(banks[1]?.slots.map((slot) => (slot.kind === 'color' ? slot.rgb : ''))).toEqual(banks[0]?.slots.map((slot) => (slot.kind === 'color' ? slot.rgb : '')));
  });

  it('keeps the first sprite on the first palette and makes the extra palettes part of the same undo step', () => {
    const file = platformFile(chosen('snes-sprite'));
    expect(artworkOf(file).sprites[0]?.bankId).toBe(artworkOf(file).banks[0]?.id);
    expect(file.host.undo(file.documentId).ok).toBe(true);
    expect(artworkOf(file).banks).toHaveLength(1);
  });

  it('lets the user ask for another count', () => {
    const file = platformFile(patchForm(chosen('snes-sprite'), { banks: 3 }));
    expect(artworkOf(file).banks).toHaveLength(3);
  });

  it('refuses a count outside 1 to 32 and says how many palettes the file gets', () => {
    expect(newFormErrors(patchForm(blank(), { banks: 0 }), []).banks).toBe('A file starts with 1 to 32 palettes.');
    expect(newFormErrors(patchForm(blank(), { banks: 33 }), []).banks).toBe('A file starts with 1 to 32 palettes.');
    expect(newFormErrors(chosen('snes-sprite'), []).banks).toBeNull();
    expect(newSummary(chosen('snes-sprite')).banks).toBe('Creates 8 palettes of 16 slots each.');
    expect(newSummary(blank()).banks).toBeNull();
  });

  it('warns once when the count is more than the platform allows', () => {
    const findings = newSummary(patchForm(chosen('snes-sprite'), { banks: 9 })).platform?.findings ?? [];
    expect(findings.map((finding) => finding.text)).toEqual(['The file has 9 palettes. SNES sprite 4bpp allows 8.']);
  });
});

describe('switching the palette of a sprite', () => {
  it('lists the palettes of the file', () => {
    const options = bankOptions(artworkOf(platformFile(chosen('snes-sprite'))));
    expect(options).toHaveLength(8);
    expect(options[0]?.label).toContain('(15 colours)');
  });

  it('moves the sprite to the other palette and keeps the slot numbers, as one undo step', () => {
    const file = platformFile(chosen('snes-sprite'));
    const [first, second] = artworkOf(file).banks;
    const sprite = artworkOf(file).sprites[0];
    if (!first || !second || !sprite) throw new Error('missing');
    paintIndex(file, 3);
    const before = revisionOf(file);
    const outcome = switchBank(file.host, file.documentId, sprite.id, second.id);
    expect(outcome.ok).toBe(true);
    expect(outcome.message).toBe(`hero now uses ${second.name}.`);
    expect(artworkOf(file).sprites[0]?.bankId).toBe(second.id);
    expect(revisionOf(file)).toBe(before + 1);
    expect(spriteIndices(file).every((value) => value === 3)).toBe(true);
    file.host.undo(file.documentId);
    expect(artworkOf(file).sprites[0]?.bankId).toBe(first.id);
  });

  it('says so when the sprite already uses that palette', () => {
    const file = platformFile(chosen('snes-sprite'));
    const sprite = artworkOf(file).sprites[0];
    const first = artworkOf(file).banks[0];
    if (!first || !sprite) throw new Error('missing');
    const outcome = switchBank(file.host, file.documentId, sprite.id, first.id);
    expect(outcome.ok).toBe(false);
    expect(outcome.message).toContain('Could not change the palette.');
  });
});
