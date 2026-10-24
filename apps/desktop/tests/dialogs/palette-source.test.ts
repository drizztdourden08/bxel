/* @layer renderer-app @kind test */
import { writeGpl, writeJascPal, writePalettePng } from '@bxel/formats';
import type { PaletteFile } from '@bxel/formats';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { describe, expect, it } from 'vitest';
import { bankPlan } from '../../src/palette-source/bank-plan';
import { PALETTE_PRESETS, SOURCE_DEFAULT } from '../../src/palette-source/palette-source.constants';
import type { PaletteSource } from '../../src/palette-source/palette-source.type';
import { pickPaletteFile } from '../../src/palette-source/pick-palette-file';
import { readPaletteFile } from '../../src/palette-source/read-palette-file';

const SAMPLE: PaletteFile = {
  name: 'Warm',
  colors: [
    { hex: '#ff0000', name: 'Red' },
    { hex: '#00ff00', name: 'Green' },
    { hex: '#ff0000', name: 'Red again' },
    { hex: '#0000ff', name: '' },
  ],
};

const bytesOf = (text: string): Uint8Array => new TextEncoder().encode(text);

const portWith = (path: string | null, files: Record<string, Uint8Array>): DocumentsPort => {
  const missing = (): Promise<never> => Promise.reject(new Error('unused'));
  return {
    open: () => Promise.resolve(path),
    saveAs: missing,
    openFolder: () => Promise.resolve(null),
    list: () => Promise.resolve({ entries: [], truncated: false }),
    read: (target) => {
      const found = files[target];
      return found ? Promise.resolve(found) : Promise.reject(new Error('missing'));
    },
    readText: missing,
    write: missing,
    writeText: missing,
    recent: () => Promise.resolve([]),
    clearRecent: () => Promise.resolve(),
    openRecent: missing,
    snapshot: missing,
    recoverable: () => Promise.resolve([]),
    restoreSnapshot: missing,
    discardSnapshot: () => Promise.resolve(),
  };
};

describe('reading a palette file', () => {
  it('reads a GPL file and drops repeated colors', () => {
    const written = writeGpl(SAMPLE);
    expect(written.ok).toBe(true);
    const read = readPaletteFile(bytesOf(written.ok ? written.text : ''), 'warm.gpl');
    expect(read.ok && read.palette.name).toBe('Warm');
    expect(read.ok && read.palette.colors.map((color) => color.rgb)).toEqual(['#ff0000', '#00ff00', '#0000ff']);
  });

  it('reads a JASC PAL file and names it after the file', () => {
    const written = writeJascPal(SAMPLE);
    const read = readPaletteFile(bytesOf(written.ok ? written.text : ''), 'sunset.pal');
    expect(read.ok && read.palette.name).toBe('sunset');
    expect(read.ok && read.palette.colors).toHaveLength(3);
  });

  it('reads a palette PNG', () => {
    const written = writePalettePng(SAMPLE, 'row');
    const read = readPaletteFile(written.ok ? written.bytes : new Uint8Array(), 'strip.png');
    expect(read.ok && read.palette.colors.map((color) => color.rgb)).toContain('#00ff00');
  });

  it('says plainly when the file cannot be read', () => {
    const message = 'Cannot read that palette file. Bxel opens GPL, PAL and palette PNG files.';
    expect(readPaletteFile(bytesOf('hello'), 'notes.txt')).toEqual({ ok: false, message });
    expect(readPaletteFile(bytesOf('hello'), 'bad.gpl')).toEqual({ ok: false, message });
  });

  it('reads through the documents port and keeps a cancelled pick quiet', async () => {
    const written = writeGpl(SAMPLE);
    const files = { 'C:\\art\\warm.gpl': bytesOf(written.ok ? written.text : '') };
    const picked = await pickPaletteFile(portWith('C:\\art\\warm.gpl', files));
    expect(picked?.ok && picked.palette.fileName).toBe('warm.gpl');
    expect(await pickPaletteFile(portWith(null, files))).toBeNull();
    expect(await pickPaletteFile(portWith('C:\\art\\gone.gpl', files))).toMatchObject({ ok: false });
  });
});

describe('the palette presets', () => {
  it('lists Bxel 16 first with 15 colors', () => {
    expect(PALETTE_PRESETS[0]?.name).toBe('Bxel 16');
    expect(PALETTE_PRESETS[0]?.colors).toHaveLength(15);
    expect(PALETTE_PRESETS.length).toBeGreaterThanOrEqual(4);
  });

  it('takes the colors that fit the limit and counts the rest', () => {
    const pico: PaletteSource = { kind: 'preset', presetId: 'pico-8', file: null };
    expect(bankPlan(pico, 16, true).dropped).toBe(1);
    expect(bankPlan(pico, 16, false).dropped).toBe(0);
    expect(bankPlan(pico, 32, true).bank.colors).toHaveLength(16);
  });

  it('keeps an opaque custom palette usable with at least one color', () => {
    const custom: PaletteSource = { ...SOURCE_DEFAULT, kind: 'custom' };
    expect(bankPlan(custom, 1, false).bank.colors).toHaveLength(1);
    expect(bankPlan(custom, 1, true).bank.colors).toHaveLength(0);
  });
});
