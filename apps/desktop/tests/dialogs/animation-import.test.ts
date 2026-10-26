/* @layer renderer-app @kind test */
import type { DocumentId, Sprite } from '@bxel/document';
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
import { newHost, sourceImage, sprites } from './dialog-harness';
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

const firstPixel = (owned: readonly Sprite[], id: string | null): number | undefined =>
  Object.values(owned.find((each) => each.id === id)?.cels ?? {})[0]?.pixels[0];

const stripPaint = (x: number): readonly [number, number, number, number] => {
  const channel = Math.min(2, Math.floor(x / 4));
  return [channel === 0 ? 255 : 0, channel === 1 ? 255 : 0, channel === 2 ? 255 : 0, 255];
};

const animationsOf = (host: ReturnType<typeof newHost>, documentId: DocumentId) => host.view(documentId)?.state.artwork.animations ?? [];

describe('importing an animated image', () => {
  it.each(FORMATS)('makes one animation with a frame for each picture of a %s, in one undo step', (_, bytes, fileName) => {
    const host = newHost();
    const image = imageOf(bytes, fileName);
    const form = formFor(image, NONE, { kind: 'animation', reduce: 'extract', name: 'run' });
    const outcome = runImport(host, runOf(form, image, NONE));
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const [animation] = animationsOf(host, outcome.documentId);
    expect(animationsOf(host, outcome.documentId)).toHaveLength(1);
    expect(outcome.created['animation']).toBe(animation?.id);
    expect(animation?.frames.map((frame) => frame.durationMs)).toEqual(delaysMs);
    const owned = sprites(host, outcome.documentId);
    expect(owned.filter((sprite) => sprite.role === 'sprite')).toHaveLength(0);
    expect(owned.filter((sprite) => sprite.role === 'frame')).toHaveLength(3);
    expect(new Set(animation?.frames.map((frame) => firstPixel(owned, frame.spriteId))).size).toBe(3);
    expect(host.undo(outcome.documentId).ok).toBe(true);
    expect(animationsOf(host, outcome.documentId)).toHaveLength(0);
  });

  it('makes an animation of a strip, one frame for every cell', () => {
    const host = newHost();
    const image = sourceImage(12, 4, stripPaint, 'walk.png');
    const slice = { cellWidth: 4, cellHeight: 4, offsetX: 0, offsetY: 0, spacingX: 0, spacingY: 0, order: 'rows' as const, names: '' };
    const form = formFor(image, NONE, { kind: 'strip', reduce: 'extract', name: 'walk', slice });
    const run = runOf(form, image, NONE);
    expect(run.rects).toHaveLength(3);
    const outcome = runImport(host, run);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const [animation] = animationsOf(host, outcome.documentId);
    expect([animation?.width, animation?.height, animation?.frames.length]).toEqual([4, 4, 3]);
    expect(sprites(host, outcome.documentId).every((sprite) => sprite.role === 'frame')).toBe(true);
  });
});
