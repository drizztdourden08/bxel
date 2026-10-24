/* @layer tests @kind helper */
import { encodePngRgba, PNG_SIGNATURE, writePngChunk } from '@bxel/formats';
import { listChunks } from './list-chunks';

type RawApngFrame = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly pixels: readonly number[];
  readonly delayNum: number;
  readonly delayDen: number;
  readonly dispose: number;
  readonly blend: number;
};

type RawApng = {
  readonly width: number;
  readonly height: number;
  readonly plays: number;
  readonly sequenceSkew: number;
  readonly frames: readonly RawApngFrame[];
};

const control = (sequence: number, frame: RawApngFrame): Uint8Array => {
  const data = new Uint8Array(26);
  const view = new DataView(data.buffer);
  view.setUint32(0, sequence);
  view.setUint32(4, frame.width);
  view.setUint32(8, frame.height);
  view.setUint32(12, frame.x);
  view.setUint32(16, frame.y);
  view.setUint16(20, frame.delayNum);
  view.setUint16(22, frame.delayDen);
  data[24] = frame.dispose;
  data[25] = frame.blend;
  return writePngChunk('fcTL', data);
};

const imageData = (frame: RawApngFrame): Uint8Array => {
  const png = encodePngRgba({
    data: Uint8ClampedArray.from(frame.pixels),
    width: frame.width,
    height: frame.height,
  });
  if (!png.ok) throw new Error(png.message);
  const idat = listChunks(png.bytes).find((chunk) => chunk.type === 'IDAT');
  return idat?.data ?? new Uint8Array(0);
};

const buildApng = (spec: RawApng): Uint8Array => {
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, spec.width);
  view.setUint32(4, spec.height);
  header[8] = 8;
  header[9] = 6;
  const actl = new Uint8Array(8);
  new DataView(actl.buffer).setUint32(0, spec.frames.length);
  new DataView(actl.buffer).setUint32(4, spec.plays);
  const parts: Uint8Array[] = [PNG_SIGNATURE, writePngChunk('IHDR', header), writePngChunk('acTL', actl)];
  spec.frames.forEach((frame, i) => {
    const skew = i >= 2 ? spec.sequenceSkew : 0;
    const sequence = i === 0 ? 0 : 2 * i - 1 + skew;
    parts.push(control(sequence, frame));
    if (i === 0) {
      parts.push(writePngChunk('IDAT', imageData(frame)));
    } else {
      const data = imageData(frame);
      const fdat = new Uint8Array(4 + data.length);
      new DataView(fdat.buffer).setUint32(0, sequence + 1);
      fdat.set(data, 4);
      parts.push(writePngChunk('fdAT', fdat));
    }
  });
  parts.push(writePngChunk('IEND', new Uint8Array(0)));
  return Uint8Array.from(parts.flatMap((part) => Array.from(part)));
};

export type { RawApng, RawApngFrame };
export { buildApng };
