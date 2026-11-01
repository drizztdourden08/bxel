/* @layer tests @kind test */
import {
  FORMAT_ERROR_CODE,
  readAse,
  readHex,
  readPaintNet,
  writeAse,
  writeHex,
  writePaintNet,
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

const mustText = (result: ReturnType<typeof writeHex>): string => {
  if (!result.ok) throw new Error(result.message);
  return result.text;
};

const mustBytes = (result: ReturnType<typeof writeAse>): Uint8Array => {
  if (!result.ok) throw new Error(result.message);
  return result.bytes;
};

const hexes = (palette: PaletteFile): string[] => palette.colors.map((color) => color.hex);

describe('Lospec .hex', () => {
  it('round trips colours and drops names', () => {
    const text = mustText(writeHex(NAMED));
    expect(text).toBe('000000\nff0000\n10a0ff\nffffff\n7f7f7f\n');
    expect(hexes(mustRead(readHex(text)))).toEqual(hexes(NAMED));
  });

  it('keeps alpha and reads hashes, blank lines and CRLF', () => {
    const alpha: PaletteFile = { name: '', colors: [{ hex: '#12345680', name: '' }] };
    const text = mustText(writeHex(alpha));
    expect(text).toBe('12345680\n');
    expect(hexes(mustRead(readHex(`\r\n#AA00bb\r\n\r\n${text}`)))).toEqual(['#aa00bb', '#12345680']);
  });

  it('rejects malformed files', () => {
    expect(readHex('')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
    expect(readHex('ff0000\nnope')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
  });
});

describe('Paint.net .txt', () => {
  it('round trips the palette name and colours', () => {
    const text = mustText(writePaintNet(NAMED));
    expect(text.split('\r\n').slice(0, 4)).toEqual([
      '; paint.net Palette File',
      '; Palette Name: Sunset 16',
      '; Colors: 5',
      'FF000000',
    ]);
    const read = mustRead(readPaintNet(text));
    expect(read.name).toBe('Sunset 16');
    expect(hexes(read)).toEqual(hexes(NAMED));
  });

  it('keeps alpha in the leading byte', () => {
    const alpha: PaletteFile = { name: '', colors: [{ hex: '#12345680', name: '' }] };
    const text = mustText(writePaintNet(alpha));
    expect(text).toContain('80123456');
    expect(mustRead(readPaintNet(text)).colors[0]?.hex).toBe('#12345680');
  });

  it('rejects malformed files', () => {
    expect(readPaintNet('; only a comment')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
    expect(readPaintNet('FF0000')).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
  });
});

const aseEntry = (model: string, values: number[]): number[] => {
  const body = new Uint8Array(2 + 2 + 4 + values.length * 4 + 2);
  const view = new DataView(body.buffer);
  view.setUint16(0, 1);
  for (let i = 0; i < 4; i += 1) view.setUint8(4 + i, model.charCodeAt(i));
  values.forEach((value, i) => view.setFloat32(8 + i * 4, value));
  const block = new Uint8Array(6 + body.length);
  const head = new DataView(block.buffer);
  head.setUint16(0, 1);
  head.setUint32(2, body.length);
  block.set(body, 6);
  return [...block];
};

describe('Adobe .ase', () => {
  it('round trips names and colours inside a named group', () => {
    const bytes = mustBytes(writeAse(NAMED));
    expect(String.fromCharCode(...bytes.subarray(0, 4))).toBe('ASEF');
    const read = mustRead(readAse(bytes));
    expect(read.name).toBe('Sunset 16');
    expect(read.colors).toEqual(NAMED.colors);
  });

  it('writes no group for an unnamed palette and drops alpha', () => {
    const plain: PaletteFile = { name: '', colors: [{ hex: '#12345680', name: 'Half' }] };
    expect(mustRead(readAse(mustBytes(writeAse(plain))))).toEqual({
      name: '',
      colors: [{ hex: '#123456', name: 'Half' }],
    });
  });

  it('reads grey and CMYK entries and skips unknown colour models', () => {
    const blocks = [...aseEntry('Gray', [0.5]), ...aseEntry('CMYK', [0, 1, 1, 0]), ...aseEntry('LAB ', [50, 0, 0])];
    const bytes = Uint8Array.from([0x41, 0x53, 0x45, 0x46, 0, 1, 0, 0, 0, 0, 0, 3, ...blocks]);
    expect(hexes(mustRead(readAse(bytes)))).toEqual(['#808080', '#ff0000']);
  });

  it('rejects malformed files', () => {
    expect(readAse(new Uint8Array(4))).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
    const bytes = mustBytes(writeAse(NAMED));
    expect(readAse(bytes.subarray(0, bytes.length - 5))).toMatchObject({ code: FORMAT_ERROR_CODE.PALETTE_INVALID_DATA });
  });
});
