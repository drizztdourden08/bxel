/* @layer core @kind test */
import type { AssetSlice, PaletteBank, Rgb, Swatch, SwatchId } from '@bxel/document';
import {
  formatSwatchColor,
  frameToRgba,
  paletteRgba,
  parseSwatchColor,
  swatchAlpha,
  swatchFields,
} from '@bxel/document';
import { decodePalette, encodePalette } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { assetClock, heartBank, heartSprite, paletteSlice } from './asset-fixture';
import { brand, fixtureToArtwork } from './fixture-to-artwork';
import { heartPairFixture } from './heart-pair-fixture';

const HALF = 128;

const swatch = (id: string, rgb: string, alpha?: number): Swatch => ({
  id: brand<SwatchId>(id),
  kind: 'color',
  rgb: rgb as Rgb,
  ...(alpha === undefined ? {} : { alpha }),
  name: rgb,
});

const bankWith = (slots: readonly Swatch[]): PaletteBank => ({ ...heartBank(), slots, cap: 16, transparent: slots[0]?.kind === 'transparent', ramps: [] });

const sliceWith = (bank: PaletteBank): AssetSlice => ({ ...paletteSlice(), artwork: { banks: [bank] } });

describe('swatch alpha: reading colours', () => {
  it('reads a missing alpha as opaque and a transparent swatch as clear', () => {
    expect(swatchAlpha(swatch('sw_000001', '#102030'))).toBe(255);
    expect(swatchAlpha(swatch('sw_000001', '#102030', HALF))).toBe(HALF);
    expect(swatchAlpha({ id: brand<SwatchId>('sw_000002'), kind: 'transparent' })).toBe(0);
  });

  it('parses six and eight digit colours and keeps six digits when opaque', () => {
    expect(parseSwatchColor('#A1B2C3')).toEqual({ rgb: '#a1b2c3', alpha: 255 });
    expect(parseSwatchColor('#A1B2C380')).toEqual({ rgb: '#a1b2c3', alpha: HALF });
    expect(parseSwatchColor('#a1b2c')).toBeNull();
    expect(parseSwatchColor('a1b2c3')).toBeNull();
    expect(formatSwatchColor('#a1b2c3', undefined)).toBe('#a1b2c3');
    expect(formatSwatchColor('#a1b2c3', 255)).toBe('#a1b2c3');
    expect(formatSwatchColor('#a1b2c3', 5)).toBe('#a1b2c305');
    expect(swatchFields('#a1b2c3', 255)).toEqual({ rgb: '#a1b2c3' });
    expect(swatchFields('#a1b2c3', 0)).toEqual({ rgb: '#a1b2c3', alpha: 0 });
  });
});

describe('swatch alpha: rendering', () => {
  it('puts the alpha of each swatch in the colour table', () => {
    const bank = bankWith([
      { id: brand<SwatchId>('sw_000001'), kind: 'transparent' },
      swatch('sw_000002', '#ff0000'),
      swatch('sw_000003', '#00ff00', HALF),
      swatch('sw_000004', '#0000ff', 0),
    ]);
    expect(Array.from(paletteRgba(bank))).toEqual([0, 0, 0, 0, 255, 0, 0, 255, 0, 255, 0, HALF, 0, 0, 255, 0]);
  });

  it('draws a frame with the alpha of the swatches its pixels use', () => {
    const artwork = fixtureToArtwork(heartPairFixture);
    const sprite = heartSprite();
    const frame = sprite.frames[0];
    const bank = artwork.banks[0];
    if (!frame || !bank) throw new Error('The fixture is incomplete.');
    const translucent: PaletteBank = {
      ...bank,
      slots: bank.slots.map((slot) => (slot.kind === 'color' ? { ...slot, alpha: HALF } : slot)),
    };
    const opaque = frameToRgba(sprite, bank, frame.id);
    const half = frameToRgba(sprite, translucent, frame.id);
    for (let at = 0; at < opaque.length; at += 4) {
      expect(half[at + 3]).toBe(opaque[at + 3] === 0 ? 0 : HALF);
      expect(half[at]).toBe(opaque[at]);
    }
  });
});

describe('swatch alpha: files', () => {
  it('keeps the alpha of a swatch through a palette file', () => {
    const bank = bankWith([swatch('sw_000001', '#ff0000'), swatch('sw_000002', '#00ff00', HALF), swatch('sw_000003', '#0000ff', 0)]);
    const report = decodePalette(encodePalette(sliceWith(bank), null, assetClock));
    expect(report.outcome).toBe('ok');
    expect(report.slice?.artwork.banks?.[0]?.slots).toEqual(bank.slots);
  });

  it('reads a palette written before alpha existed as opaque and writes it without alpha', () => {
    const bank = bankWith([swatch('sw_000001', '#ff0000'), swatch('sw_000002', '#00ff00')]);
    const bytes = encodePalette(sliceWith(bank), null, assetClock);
    const read = decodePalette(bytes).slice?.artwork.banks?.[0];
    expect(read?.slots.map(swatchAlpha)).toEqual([255, 255]);
    expect(read?.slots.some((slot) => slot.kind === 'color' && 'alpha' in slot)).toBe(false);
  });

  it('refuses an alpha outside 0 to 255', () => {
    const bank = bankWith([swatch('sw_000001', '#ff0000', 300)]);
    const report = decodePalette(encodePalette(sliceWith(bank), null, assetClock));
    expect(report.outcome).not.toBe('ok');
  });
});
