/* @layer tests @kind test */
import { decodeApng, decodeGif, decodePng, encodeApng, encodeGif, encodePngIndexed, readPalettePng, writePalettePng } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { listChunks } from './list-chunks';

const HALF = 128;

const PALETTE = Uint8Array.from([0, 0, 0, 0, 255, 0, 0, 255, 0, 255, 0, HALF, 0, 0, 255, 40]);

const INDICES = Uint8Array.from([0, 1, 2, 3]);

const SIDE = 2;

const wanted = (palette: Uint8Array, indices: Uint8Array): number[] =>
  Array.from(indices).flatMap((index) => Array.from(palette.subarray(index * 4, index * 4 + 4)));

describe('palette alpha in PNG and APNG', () => {
  it('writes every partial alpha of the palette into tRNS and reads it back', () => {
    const encoded = encodePngIndexed({ indices: INDICES, palette: PALETTE, width: SIDE, height: SIDE });
    if (!encoded.ok) throw new Error(encoded.message);
    const trns = listChunks(encoded.bytes).find((chunk) => chunk.type === 'tRNS');
    expect(Array.from(trns?.data ?? [])).toEqual([0, 255, HALF, 40]);
    const decoded = decodePng(encoded.bytes);
    if (!decoded.ok) throw new Error(decoded.message);
    expect(Array.from(decoded.data)).toEqual(wanted(PALETTE, INDICES));
  });

  it('keeps the palette alpha in an indexed APNG', () => {
    const frames = [{ pixels: INDICES, delayMs: 100 }];
    const encoded = encodeApng({ width: SIDE, height: SIDE, palette: PALETTE, loops: 0, frames });
    if (!encoded.ok) throw new Error(encoded.message);
    const decoded = decodeApng(encoded.bytes);
    if (!decoded.ok) throw new Error(decoded.message);
    expect(Array.from(decoded.frames[0]?.data ?? [])).toEqual(wanted(PALETTE, INDICES));
  });

  it('round trips the alpha of a palette strip', () => {
    const written = writePalettePng(
      {
        name: 'Glass',
        colors: [
          { hex: '#ff0000', name: '' },
          { hex: '#00ff0080', name: '' },
          { hex: '#0000ff28', name: '' },
        ],
      },
      'row',
    );
    if (!written.ok) throw new Error(written.message);
    const read = readPalettePng(written.bytes);
    expect(read.ok && read.palette.colors.map((color) => color.hex)).toEqual(['#ff0000', '#00ff0080', '#0000ff28']);
  });
});

describe('palette alpha in GIF', () => {
  const gif = (palette: Uint8Array, transparentIndex: number | null) => {
    const encoded = encodeGif({ width: SIDE, height: SIDE, palette, transparentIndex, loops: 0, frames: [{ indices: INDICES, delayMs: 100 }] });
    if (!encoded.ok) throw new Error(encoded.message);
    const decoded = decodeGif(encoded.bytes);
    if (!decoded.ok) throw new Error(decoded.message);
    return Array.from(decoded.frames[0]?.data ?? []);
  };

  it('turns the entries below half alpha into the transparent index and keeps the rest opaque', () => {
    const pixels = gif(PALETTE, 0);
    expect(pixels.slice(0, 4)).toEqual([0, 0, 0, 0]);
    expect(pixels.slice(4, 8)).toEqual([255, 0, 0, 255]);
    expect(pixels.slice(8, 12)).toEqual([0, 255, 0, 255]);
    expect(pixels.slice(12, 16)).toEqual([0, 0, 0, 0]);
  });

  it('picks the first clear entry when no transparent index is given', () => {
    const palette = Uint8Array.from([9, 9, 9, 255, 255, 0, 0, 0, 0, 255, 0, 255, 5, 5, 5, 255]);
    expect(gif(palette, null)).toEqual([9, 9, 9, 255, 0, 0, 0, 0, 0, 255, 0, 255, 5, 5, 5, 255]);
  });

  it('changes nothing for a palette without clear entries', () => {
    const palette = Uint8Array.from([1, 2, 3, 255, 4, 5, 6, 255, 7, 8, 9, 255, 10, 11, 12, 255]);
    expect(gif(palette, null)).toEqual(wanted(palette, INDICES));
  });
});
