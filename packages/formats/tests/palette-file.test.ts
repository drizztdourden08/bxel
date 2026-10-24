/* @layer tests @kind test */
import {
  decodePng,
  encodePngRgba,
  FORMAT_ERROR_CODE,
  formatHexColor,
  parseHexColor,
  readGpl,
  readJascPal,
  readPalettePng,
  writeGpl,
  writeJascPal,
  writePalettePng,
} from '@bxel/formats';
import type { PaletteFile, PaletteReadResult } from '@bxel/formats';
import { describe, expect, it } from 'vitest';

const NAMED: PaletteFile = {
  name: 'Sunset 16',
  colors: [
    { hex: '#000000', name: 'Black' },
    { hex: '#ff0000', name: 'Red' },
    { hex: '#10a0ff', name: 'Sky blue' },
    { hex: '#ffffff', name: '' },
    { hex: '#7f7f7f', name: 'Grey 50' },
  ],
};

const mustRead = (result: PaletteReadResult): PaletteFile => {
  if (!result.ok) throw new Error(result.message);
  return result.palette;
};

const mustText = (result: ReturnType<typeof writeGpl>): string => {
  if (!result.ok) throw new Error(result.message);
  return result.text;
};

describe('hex colours', () => {
  it('parses and formats with optional alpha', () => {
    expect(parseHexColor('#10A0ff')).toEqual([16, 160, 255, 255]);
    expect(parseHexColor('10a0ff80')).toEqual([16, 160, 255, 128]);
    expect(formatHexColor(16, 160, 255, 255)).toBe('#10a0ff');
    expect(formatHexColor(0, 0, 0, 0)).toBe('#00000000');
    for (const bad of ['', '#12', '#12345', '#gg0000', '#1234567']) expect(parseHexColor(bad)).toBeUndefined();
  });
});

describe('GIMP .gpl', () => {
  it('round trips names and colours', () => {
    const text = mustText(writeGpl(NAMED));
    expect(text.startsWith('GIMP Palette\nName: Sunset 16\n')).toBe(true);
    expect(mustRead(readGpl(text))).toEqual(NAMED);
  });

  it('reads files written by other tools', () => {
    const text = '﻿GIMP Palette\r\nName: Other\r\nColumns: 4\r\n# note\r\n  0   0   0\tBlack\r\n255 128   1 Orange peel\r\n\r\n';
    expect(mustRead(readGpl(text))).toEqual({
      name: 'Other',
      colors: [
        { hex: '#000000', name: 'Black' },
        { hex: '#ff8001', name: 'Orange peel' },
      ],
    });
  });

  it('rejects malformed files without throwing', () => {
    expect(readGpl('Not a palette')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
    expect(readGpl('GIMP Palette\n300 0 0 x')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
    expect(readGpl('GIMP Palette\nred')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
    const bad: PaletteFile = { name: 'x', colors: [{ hex: 'nope', name: '' }] };
    expect(writeGpl(bad)).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_INPUT });
  });
});

describe('JASC .pal', () => {
  it('round trips colours and drops names', () => {
    const text = mustText(writeJascPal(NAMED));
    expect(text).toBe('JASC-PAL\r\n0100\r\n5\r\n0 0 0\r\n255 0 0\r\n16 160 255\r\n255 255 255\r\n127 127 127\r\n');
    const read = mustRead(readJascPal(text));
    expect(read.colors.map((color) => color.hex)).toEqual(NAMED.colors.map((color) => color.hex));
    expect(read.colors.every((color) => color.name === '')).toBe(true);
  });

  it('rejects malformed files', () => {
    expect(readJascPal('JASC-PAL\r\n0200\r\n1\r\n0 0 0')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
    expect(readJascPal('JASC-PAL\r\n0100\r\n3\r\n0 0 0\r\n1 1 1')).toMatchObject({
      code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA,
    });
    expect(readJascPal('JASC-PAL\r\n0100\r\nx')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_TOO_LARGE });
  });
});

describe('palette PNG', () => {
  const withAlpha: PaletteFile = {
    name: '',
    colors: [...NAMED.colors.map((color) => ({ hex: color.hex, name: '' })), { hex: '#12345680', name: '' }, { hex: '#10a0ff', name: '' }],
  };

  it.each(['row', 'column'] as const)('round trips a %s strip with duplicates and alpha', (layout) => {
    const written = writePalettePng(withAlpha, layout);
    if (!written.ok) throw new Error(written.message);
    const png = decodePng(written.bytes);
    expect(png.ok && [png.width, png.height]).toEqual(layout === 'row' ? [7, 1] : [1, 7]);
    expect(mustRead(readPalettePng(written.bytes))).toEqual(withAlpha);
  });

  it('reads a grid image as its distinct colours in reading order', () => {
    const data = Uint8ClampedArray.from([
      ...[255, 0, 0, 255, 0, 255, 0, 255],
      ...[255, 0, 0, 255, 0, 0, 255, 255],
    ]);
    const encoded = encodePngRgba({ data, width: 2, height: 2 });
    if (!encoded.ok) throw new Error(encoded.message);
    expect(mustRead(readPalettePng(encoded.bytes)).colors.map((color) => color.hex)).toEqual([
      '#ff0000',
      '#00ff00',
      '#0000ff',
    ]);
  });

  it('rejects empty palettes and non PNG bytes', () => {
    expect(writePalettePng({ name: '', colors: [] }, 'row')).toMatchObject({
      code: FORMAT_ERROR_CODE.PALETTE_INVALID_INPUT,
    });
    expect(readPalettePng(new Uint8Array(5))).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
  });
});
