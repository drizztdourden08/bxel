/* @layer renderer-app @kind test */
import type { BankId, PaletteBank, SwatchId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { hexListOf } from '../../src/palette-export/hex-list-of';
import { paletteExportBytes } from '../../src/palette-export/palette-export-bytes';
import { PALETTE_EXPORT_FORMATS } from '../../src/palette-export/palette-export.constants';
import { paletteFileOf } from '../../src/palette-export/palette-file-of';
import { importPlan } from '../../src/palette-import/import-plan';
import { sourceFromText } from '../../src/palette-import/source-from-text';
import { readPaletteFile } from '../../src/palette-source/read-palette-file';

const slot = (id: string, rgb: string, name: string) => ({ id: id as SwatchId, kind: 'color' as const, rgb: rgb as never, name });

const bank: PaletteBank = {
  id: 'bnk_a' as BankId,
  name: 'Dusk',
  cap: 8,
  transparent: true,
  slots: [{ id: 'swt_0' as SwatchId, kind: 'transparent' }, slot('swt_1', '#112233', 'Navy'), slot('swt_2', '#ff8800', '#ff8800'), slot('swt_3', '#445566', 'Slate')],
  ramps: [],
};

describe('K3 paletteFileOf', { tags: ['critical'] }, () => {
  it('leaves out the transparent swatch and the colour-named labels', () => {
    const file = paletteFileOf(bank);
    expect(file.name).toBe('Dusk');
    expect(file.colors.map((color) => color.name)).toEqual(['Navy', '', 'Slate']);
  });

  it('keeps only the wanted indices', () => {
    expect(paletteFileOf(bank, [1, 3]).colors).toHaveLength(2);
  });
});

describe('K3 hexListOf', { tags: ['critical'] }, () => {
  it('lists one upper-case colour per line', () => {
    expect(hexListOf(bank, [1, 2])).toBe('#112233\n#FF8800');
  });
});

describe('K3 paletteExportBytes', { tags: ['critical'] }, () => {
  const file = paletteFileOf(bank);

  it.each(PALETTE_EXPORT_FORMATS.filter((format) => format.extension !== 'png'))('writes $label so it reads back with the same colours', (format) => {
    const written = paletteExportBytes(file, format);
    expect(written.ok).toBe(true);
    if (!written.ok) return;
    const read = readPaletteFile(written.bytes, `out.${format.extension}`);
    expect(read.ok).toBe(true);
    if (read.ok) expect(read.palette.colors.map((color) => color.rgb.toLowerCase())).toEqual(['#112233', '#ff8800', '#445566']);
  });

  it.each(PALETTE_EXPORT_FORMATS.filter((format) => format.extension === 'png'))('writes $label as a PNG', (format) => {
    const written = paletteExportBytes(file, format);
    expect(written.ok).toBe(true);
    if (written.ok) expect([...written.bytes.slice(1, 4)]).toEqual([0x50, 0x4e, 0x47]);
  });
});

describe('K1 importPlan', { tags: ['critical'] }, () => {
  const colors = [
    { rgb: '#112233', name: 'Navy' },
    { rgb: '#abcdef', name: 'Sky' },
    { rgb: '#fedcba', name: 'Peach' },
  ];

  it('adds only the colours that are not there yet', () => {
    const plan = importPlan(bank, colors, 'append');
    expect(plan.present).toHaveLength(1);
    expect(plan.kept.map((color) => color.rgb)).toEqual(['#abcdef', '#fedcba']);
    expect(plan.steps).toHaveLength(1);
  });

  it('counts what does not fit as over', () => {
    const tight = { ...bank, cap: 5 };
    const plan = importPlan(tight, colors, 'append');
    expect(plan.kept).toHaveLength(1);
    expect(plan.over).toHaveLength(1);
  });

  it('replaces with every colour that fits the opaque slots', () => {
    const plan = importPlan(bank, colors, 'replace');
    expect(plan.kept).toHaveLength(3);
    expect(plan.steps[0]?.options).toMatchObject({ mode: 'replace' });
  });

  it('makes no step when nothing goes in', () => {
    expect(importPlan(bank, [], 'map').steps).toEqual([]);
  });
});

describe('K1 sourceFromText', { tags: ['critical'] }, () => {
  it('reads a pasted hex list', () => {
    const source = sourceFromText('#112233\n#ff8800\n');
    expect(source?.colors).toHaveLength(2);
  });

  it('returns null for text with no colours', () => {
    expect(sourceFromText('nothing here')).toBeNull();
  });
});
