/* @layer renderer-app @kind test */
import { swatchAlpha } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { decodeApng, decodeGif, decodePng, writePalettePng } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { bankTable } from '../../src/editor/bank-table';
import { paletteSlots } from '../../src/editor/palette-slots';
import { bankRgba } from '../../src/export/bank-rgba';
import { planExport } from '../../src/export/plan-export';
import { recolourSwatch } from '../../src/palette-bank/recolour-swatch';
import { readPaletteFile } from '../../src/palette-source/read-palette-file';
import { librarySet } from '../../src/swatch-library/library-set';
import { loadPlan } from '../../src/swatch-library/load-plan';
import { makeSwatchSet } from '../../src/swatch-library/make-swatch-set';
import { recolorSet } from '../../src/swatch-library/recolor-set';
import { openEditor } from '../editor/editor-harness';
import { artworkOf, bytesOf, frozenOf, harness, paint, settingsOf } from '../export/export-harness';

const HALF = 128;
const PAINTED = 4;

const bytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, index) => index + 1);

const glassArtwork = (artwork: Artwork, alpha: number): Artwork => ({
  ...artwork,
  banks: artwork.banks.map((bank) => ({
    ...bank,
    slots: bank.slots.map((slot, at) => (at === PAINTED && slot.kind === 'color' ? { ...slot, alpha } : slot)),
  })),
});

describe('swatch alpha in the palette panel', () => {
  it('reports the alpha of a slot, its eight digit colour and its label', () => {
    const { host, documentId, target } = openEditor();
    expect(recolourSwatch(host, documentId, target().bank, { index: 5, rgb: '#336699', alpha: HALF }).ok).toBe(true);
    const slot = paletteSlots(target().bank)[5];
    expect(slot).toMatchObject({ hex: '#33669980', alpha: HALF, transparent: false });
    expect(slot?.label).toContain('#33669980');
    expect(paletteSlots(target().bank)[0]?.alpha).toBe(0);
    expect(paletteSlots(target().bank)[1]?.alpha).toBe(255);
  });

  it('changes only the alpha of a swatch as one command and names it after the eight digit colour', () => {
    const { host, documentId, target } = openEditor();
    const slot = target().bank.slots[5];
    const rgb = slot?.kind === 'color' ? slot.rgb : '';
    const before = host.view(documentId)?.state.revision ?? 0;
    const outcome = recolourSwatch(host, documentId, target().bank, { index: 5, rgb, alpha: HALF });
    expect(outcome.ok).toBe(true);
    expect(host.view(documentId)?.state.revision).toBe(before + 1);
    const changed = target().bank.slots[5];
    expect(changed?.kind === 'color' ? [changed.rgb, changed.alpha] : null).toEqual([rgb, HALF]);
  });

  it('does nothing when the colour and the alpha are the same', () => {
    const { host, documentId, target } = openEditor();
    const slot = target().bank.slots[5];
    const rgb = slot?.kind === 'color' ? slot.rgb : '';
    const outcome = recolourSwatch(host, documentId, target().bank, { index: 5, rgb, alpha: 255 });
    expect(outcome).toEqual({ ok: true, message: 'The colour did not change.' });
  });

  it('keeps the alpha when only the colour changes', () => {
    const { host, documentId, target } = openEditor();
    recolourSwatch(host, documentId, target().bank, { index: 5, rgb: '#336699', alpha: HALF });
    recolourSwatch(host, documentId, target().bank, { index: 5, rgb: '#112233' });
    const slot = target().bank.slots[5];
    expect(slot?.kind === 'color' ? [slot.rgb, swatchAlpha(slot)] : null).toEqual(['#112233', HALF]);
  });
});

describe('swatch alpha in the colour tables', () => {
  it('gives the export table and the canvas table the alpha of each swatch', () => {
    const { host, documentId, target } = openEditor();
    recolourSwatch(host, documentId, target().bank, { index: 5, rgb: '#336699', alpha: HALF });
    const exported = bankRgba(target().bank);
    const canvas = bankTable(target().bank);
    expect(Array.from(exported.subarray(20, 24))).toEqual([0x33, 0x66, 0x99, HALF]);
    expect(Array.from(canvas)).toEqual(Array.from(exported));
    expect(exported[3]).toBe(0);
    expect(exported[7]).toBe(255);
  });
});

describe('swatch alpha in swatch sets', () => {
  it('keeps the alpha through a set, its library entry and a recolour', () => {
    const set = makeSwatchSet('Glass', [{ rgb: '#112233', alpha: HALF, name: 'Pane' }, { rgb: '#445566', name: '#445566' }], [], bytes);
    expect(set.colors).toEqual([{ rgb: '#112233', alpha: HALF, name: 'Pane' }, { rgb: '#445566', name: '#445566' }]);
    expect(librarySet('user', set).colors[0]).toEqual({ rgb: '#112233', alpha: HALF, name: 'Pane' });
    const faded = recolorSet(set, 1, '#778899', 10);
    expect(faded.colors[1]).toEqual({ rgb: '#778899', alpha: 10, name: '#7788990a' });
    const solid = recolorSet(faded, 1, '#778899', 255);
    expect(solid.colors[1]).toEqual({ rgb: '#778899', name: '#778899' });
    expect(recolorSet(set, 0, '#abcdef').colors[0]).toEqual({ rgb: '#abcdef', alpha: HALF, name: 'Pane' });
  });

  it('treats the same colour with another alpha as another colour when loading a set', () => {
    const { target } = openEditor();
    const slot = target().bank.slots[1];
    const rgb = slot?.kind === 'color' ? slot.rgb : '#000000';
    const plan = loadPlan({ ...target().bank, cap: 64 }, [{ rgb, name: rgb }, { rgb, alpha: HALF, name: rgb }, { rgb, alpha: HALF, name: rgb }], 'append');
    expect(plan.colors).toEqual([`${rgb}80`]);
    expect(plan.skipped).toBe(1);
  });
});

describe('swatch alpha in palette files', () => {
  it('reads the alpha of a palette image and drops fully clear entries', () => {
    const written = writePalettePng(
      {
        name: 'Glass',
        colors: [
          { hex: '#ff0000', name: '' },
          { hex: '#00ff0080', name: '' },
          { hex: '#0000ff00', name: '' },
          { hex: '#00ff0080', name: '' },
        ],
      },
      'row',
    );
    if (!written.ok) throw new Error(written.message);
    const read = readPaletteFile(written.bytes, 'glass.png');
    if (!read.ok) throw new Error(read.message);
    expect(read.palette.colors).toEqual([{ rgb: '#ff0000', name: '#ff0000' }, { rgb: '#00ff00', alpha: HALF, name: '#00ff0080' }]);
  });
});

describe('swatch alpha in exports', () => {
  const glass = () => {
    const h = harness();
    paint(h, 0, 0, PAINTED);
    const frozen = frozenOf(h);
    return { h, frozen: { ...frozen, artwork: glassArtwork(frozen.artwork, HALF) } };
  };

  it('writes the alpha of the colour into a PNG', () => {
    const { frozen } = glass();
    const plan = planExport({ frozen, settings: settingsOf({}), selectedIds: [] });
    const file = plan.files[0];
    const decoded = decodePng(file ? bytesOf(file) : new Uint8Array());
    if (!decoded.ok) throw new Error(decoded.message);
    expect(decoded.data[3]).toBe(HALF);
    expect(decoded.data[7]).toBe(0);
  });

  it('writes the alpha into an indexed PNG and an APNG', () => {
    const { frozen } = glass();
    const indexed = planExport({ frozen, settings: settingsOf({ colour: 'indexed' }), selectedIds: [] }).files[0];
    const png = decodePng(indexed ? bytesOf(indexed) : new Uint8Array());
    if (!png.ok) throw new Error(png.message);
    expect(png.data[3]).toBe(HALF);
    const moving = planExport({ frozen, settings: settingsOf({ kind: 'animation', animation: 'apng' }), selectedIds: [] }).files[0];
    const apng = decodeApng(moving ? bytesOf(moving) : new Uint8Array());
    if (!apng.ok) throw new Error(apng.message);
    expect(apng.frames[0]?.data[3]).toBe(HALF);
  });

  it('makes a GIF with the colours below half alpha clear and the others solid', () => {
    const { frozen } = glass();
    const clear = planExport({ frozen: { ...frozen, artwork: glassArtwork(artworkOf(glass().h), 10) }, settings: settingsOf({ kind: 'animation', animation: 'gif' }), selectedIds: [] }).files[0];
    const faint = decodeGif(clear ? bytesOf(clear) : new Uint8Array());
    if (!faint.ok) throw new Error(faint.message);
    expect(faint.frames[0]?.data[3]).toBe(0);
    const solid = planExport({ frozen, settings: settingsOf({ kind: 'animation', animation: 'gif' }), selectedIds: [] }).files[0];
    const half = decodeGif(solid ? bytesOf(solid) : new Uint8Array());
    if (!half.ok) throw new Error(half.message);
    expect(half.frames[0]?.data[3]).toBe(255);
  });
});
