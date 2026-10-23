/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { createBank, firstCelPixels, importOptions, importStep, spriteNamed } from './import-helpers';
import { makeImage } from './make-image';
import { makeNoiseImage } from './make-noise-image';
import { currentBank, execute, makeRig, snapshotProject, succeed } from './palette-engine';
import type { Rig } from './palette-engine';

const purple = (alpha: number) => [75, 31, 160, alpha] as const;

const bankOf = (rig: Rig) => ({ bankId: rig.bankId });

const importCode = (rig: Rig, options: object): string | null => {
  const revision = rig.engine.state().revision;
  const snapshot = snapshotProject(rig.engine.state().project);
  const result = execute(rig, [importStep(options)]);
  expect(rig.engine.state().revision).toBe(revision);
  expect(snapshotProject(rig.engine.state().project)).toBe(snapshot);
  return result.ok ? null : result.error.code;
};

describe('sprite.import into an existing bank', () => {
  it('maps every pixel to an existing index for every dither mode and adds no colour', () => {
    const rig = makeRig();
    const noise = makeNoiseImage(20, 7);
    const slots = currentBank(rig).slots;
    for (const dither of ['none', 'bayer2', 'bayer4', 'bayer8'] as const) {
      succeed(execute(rig, [importStep(importOptions(`photo ${dither}`, noise, bankOf(rig), { dither }))]));
      const pixels = firstCelPixels(spriteNamed(rig, `photo ${dither}`));
      expect(pixels).toHaveLength(400);
      expect(pixels.every((index) => index >= 1 && index < slots.length)).toBe(true);
    }
    expect(currentBank(rig).slots).toBe(slots);
  });

  it('creates one sprite with Layer 1, one frame and the bank it was mapped to', () => {
    const rig = makeRig();
    const result = succeed(execute(rig, [{ ...importStep(importOptions('shot', makeNoiseImage(6, 1), bankOf(rig))), ref: 'shot' }]));
    const sprite = spriteNamed(rig, 'shot');
    expect([sprite.width, sprite.height, sprite.bankId, sprite.role]).toEqual([6, 6, rig.bankId, 'sprite']);
    expect(sprite.layers.map((layer) => layer.name)).toEqual(['Layer 1']);
    expect(sprite.frames).toHaveLength(1);
    expect(Object.keys(sprite.cels)).toHaveLength(1);
    expect(result.ok && result.created.shot).toBe(sprite.id);
  });

  it('maps colours that are already in the bank to their own slots', () => {
    const rig = makeRig();
    const image = makeImage(4, [[20, 11, 38, 255], [75, 31, 160, 255], [123, 63, 228, 255], [176, 42, 156, 255]]);
    succeed(execute(rig, [importStep(importOptions('exact', image, bankOf(rig)))]));
    expect(Array.from(firstCelPixels(spriteNamed(rig, 'exact')))).toEqual([1, 2, 3, 4]);
  });

  it('keeps the requested pivot and defaults to the centre', () => {
    const rig = makeRig();
    succeed(execute(rig, [importStep({ ...importOptions('centre', makeNoiseImage(4, 1), bankOf(rig)) })]));
    succeed(execute(rig, [importStep({ ...importOptions('corner', makeNoiseImage(4, 1), bankOf(rig)), pivot: { x2: 0, y2: 8 } })]));
    expect(spriteNamed(rig, 'centre').pivot).toEqual({ x2: 4, y2: 4 });
    expect(spriteNamed(rig, 'corner').pivot).toEqual({ x2: 0, y2: 8 });
  });
});

describe('alpha threshold', () => {
  const faded = makeImage(4, [purple(0), purple(127), purple(128), purple(255)]);
  const indicesWith = (rig: Rig, name: string, mapping?: { alphaThreshold: number }) => {
    succeed(execute(rig, [importStep(importOptions(name, faded, bankOf(rig), mapping))]));
    return Array.from(firstCelPixels(spriteNamed(rig, name)));
  };

  it('defaults to 50 percent: 128 and above is opaque', () => {
    expect(indicesWith(makeRig(), 'default')).toEqual([0, 0, 2, 2]);
  });

  it('moves with the threshold', () => {
    const rig = makeRig();
    expect(indicesWith(rig, 'strict', { alphaThreshold: 255 })).toEqual([0, 0, 0, 2]);
    expect(indicesWith(rig, 'loose', { alphaThreshold: 1 })).toEqual([0, 2, 2, 2]);
    expect(indicesWith(rig, 'all', { alphaThreshold: 0 })).toEqual([2, 2, 2, 2]);
  });

  it('writes index 0 for a clear pixel in an opaque bank, never a colour of its own', () => {
    const rig = makeRig({ transparent: false });
    expect(indicesWith(rig, 'opaque bank')).toEqual([0, 0, 1, 1]);
  });

  it('rejects a threshold above 255', () => {
    const rig = makeRig();
    expect(importCode(rig, importOptions('bad', faded, bankOf(rig), { alphaThreshold: 256 }))).toBe('INVALID_OPTION');
  });
});

describe('dithering pattern origin', () => {
  const grey = makeImage(16, Array.from({ length: 64 }, () => [128, 128, 128, 255] as const));

  it('shifts the pattern with the origin and repeats it every matrix size', () => {
    const rig = makeRig();
    const bankId = createBank(rig, ['#000000', '#ffffff'], false);
    const place = (name: string, originX: number, originY: number) => {
      const mapping = { dither: 'bayer4', originX, originY } as const;
      succeed(execute(rig, [importStep(importOptions(name, grey, { bankId }, mapping))]));
      return firstCelPixels(spriteNamed(rig, name));
    };
    const home = place('home', 0, 0);
    const moved = place('moved', 1, 0);
    const wrapped = place('wrapped', 4, 8);
    expect(moved).not.toEqual(home);
    expect(wrapped).toEqual(home);
    for (let y = 0; y < 4; y += 1) {
      for (let x = 0; x < 15; x += 1) expect(moved[y * 16 + x]).toBe(home[y * 16 + x + 1]);
    }
  });

  it('is the same on every run', () => {
    const rig = makeRig();
    const bankId = createBank(rig, ['#000000', '#ffffff'], false);
    const mapping = { dither: 'bayer8' } as const;
    succeed(execute(rig, [importStep(importOptions('one', grey, { bankId }, mapping))]));
    succeed(execute(rig, [importStep(importOptions('two', grey, { bankId }, mapping))]));
    expect(firstCelPixels(spriteNamed(rig, 'one'))).toEqual(firstCelPixels(spriteNamed(rig, 'two')));
  });
});

describe('sprite.import rejections', () => {
  const image = makeNoiseImage(4, 3);

  it('rejects an image larger than 2048 on a side and a zero side', () => {
    const rig = makeRig();
    const wide = { width: 2049, height: 1, rgba: new Uint8Array(2049 * 4) };
    const tall = { width: 1, height: 2049, rgba: new Uint8Array(2049 * 4) };
    const none = { width: 0, height: 4, rgba: new Uint8Array(0) };
    for (const oversize of [wide, tall, none]) {
      expect(importCode(rig, { ...importOptions('big', image, bankOf(rig)), image: oversize })).toBe('SIZE_OUT_OF_RANGE');
    }
  });

  it('accepts exactly 2048 on a side', () => {
    const rig = makeRig();
    const edge = { width: 2048, height: 1, rgba: new Uint8Array(2048 * 4).fill(255) };
    succeed(execute(rig, [importStep({ ...importOptions('edge', image, bankOf(rig)), image: edge })]));
    expect(spriteNamed(rig, 'edge').width).toBe(2048);
  });

  it('rejects a name that is taken, ignoring case and spaces', () => {
    const rig = makeRig();
    expect(importCode(rig, importOptions('hero', image, bankOf(rig)))).toBe('NAME_TAKEN');
    expect(importCode(rig, importOptions(' HERO ', image, bankOf(rig)))).toBe('NAME_TAKEN');
  });

  it('rejects a bad name', () => {
    const rig = makeRig();
    expect(importCode(rig, importOptions('', image, bankOf(rig)))).toBe('NAME_INVALID');
  });

  it('rejects a bank or ref that does not resolve', () => {
    const rig = makeRig();
    expect(importCode(rig, importOptions('lost', image, { bankId: 'bnk_zzzzzz' }))).toBe('TARGET_NOT_FOUND');
    expect(importCode(rig, importOptions('lost', image, { ref: 'nothing' }))).toBe('TARGET_NOT_FOUND');
  });

  it('rejects pixel data that does not match the size', () => {
    const rig = makeRig();
    const short = { width: 4, height: 4, rgba: new Uint8Array(10) };
    expect(importCode(rig, { ...importOptions('short', image, bankOf(rig)), image: short })).toBe('INVALID_OPTION');
  });

  it('rejects a pivot outside the image', () => {
    const rig = makeRig();
    expect(importCode(rig, { ...importOptions('pivot', image, bankOf(rig)), pivot: { x2: 9, y2: 0 } })).toBe('PIVOT_OUT_OF_RANGE');
  });
});
