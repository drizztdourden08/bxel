/* @layer renderer-app @kind test */
import { encodePngRgba } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { colorsView } from '../../src/image-import/colors-view';
import { readImage } from '../../src/image-import/read-image';
import { runImport } from '../../src/image-import/run-import';
import type { SourceImage } from '../../src/image-import/image-import.type';
import { apngBytes } from '../e2e/support/apng-bytes';
import { bytesOf } from '../e2e/support/bytes-of';
import { gifBytes } from '../e2e/support/gif-bytes';
import { IMPORTED_ANIMATION } from '../e2e/support/imported-animation.constants';
import { solidRgba } from '../e2e/support/solid-rgba';
import { newHost, sprites } from './dialog-harness';
import { formFor, NONE, runOf } from './import-run-harness';

const { side, delaysMs, colours } = IMPORTED_ANIMATION;

const imageOf = (bytes: Uint8Array, fileName: string): SourceImage => {
  const read = readImage(bytes, fileName);
  if (!read.ok) throw new Error(read.message);
  return read.image;
};

const FORMATS = [
  ['GIF', gifBytes(3), 'run.gif'],
  ['APNG', apngBytes(3), 'run.png'],
] as const;

describe('reading an animated image', () => {
  it.each(FORMATS)('reads every frame of a %s with its duration', (_, bytes, fileName) => {
    const image = imageOf(bytes, fileName);
    expect([image.width, image.height]).toEqual([side, side]);
    expect(image.frames?.map((frame) => frame.delayMs)).toEqual(delaysMs);
    expect(image.frames?.map((frame) => Array.from(frame.data.subarray(0, 4)))).toEqual(colours);
    expect(Array.from(image.data.subarray(0, 4))).toEqual(colours[0]);
  });

  it('treats a one frame GIF and an ordinary PNG as still images', () => {
    expect(imageOf(gifBytes(1), 'still.gif').frames).toBeUndefined();
    const png = bytesOf(encodePngRgba({ width: side, height: side, data: Uint8ClampedArray.from(solidRgba(colours[0])) }));
    expect(imageOf(png, 'still.png').frames).toBeUndefined();
  });

  it('refuses a file that is no image the editor reads', () => {
    const read = readImage(Uint8Array.from([1, 2, 3, 4]), 'bad.gif');
    expect(read.ok).toBe(false);
    expect(!read.ok && read.message).toContain('GIF');
  });

  it('counts the colours of every frame', () => {
    const image = imageOf(gifBytes(3), 'run.gif');
    expect(colorsView(formFor(image, NONE, { reduce: 'extract' }), image, NONE).count).toBe(3);
  });
});

describe('importing an animated image', () => {
  it.each(FORMATS)('makes one sprite with a frame for each picture of a %s, in one undo step', (_, bytes, fileName) => {
    const host = newHost();
    const image = imageOf(bytes, fileName);
    const form = formFor(image, NONE, { reduce: 'extract', name: 'run' });
    const outcome = runImport(host, runOf(form, image, NONE));
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const [sprite] = sprites(host, outcome.documentId);
    expect(sprites(host, outcome.documentId)).toHaveLength(1);
    expect(sprite?.frames.map((frame) => frame.durationMs)).toEqual(delaysMs);
    expect(Object.keys(sprite?.cels ?? {})).toHaveLength(3);
    const firsts = sprite?.frames.map((frame) => {
      const celId = sprite.layers[0]?.cels[frame.id];
      return celId ? sprite.cels[celId]?.pixels[0] : undefined;
    });
    expect(new Set(firsts).size).toBe(3);
    expect(host.undo(outcome.documentId).ok).toBe(true);
    expect(sprites(host, outcome.documentId)).toHaveLength(0);
  });
});
