/* @layer tests @kind test */
import type { Sprite } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { importOptions, importStep, redoLast, spriteNamed, undoLast } from './import-helpers';
import { makeImage } from './make-image';
import { execute, makeRig, rejectionCode, succeed } from './palette-engine';

const RED = [176, 42, 156, 255] as const;
const BLUE = [75, 31, 160, 255] as const;
const GREEN = [123, 63, 228, 255] as const;

const rgbaOf = (...pixels: (readonly number[])[]): Uint8Array => Uint8Array.from(pixels.flat());

const pixelsOf = (sprite: Sprite, at: number): Uint8Array | undefined => {
  const frame = sprite.frames[at];
  const celId = frame ? sprite.layers[0]?.cels[frame.id] : undefined;
  return celId ? sprite.cels[celId]?.pixels : undefined;
};

const animated = (rig: ReturnType<typeof makeRig>, extra: object = {}) => ({
  ...importOptions('walk', makeImage(2, [RED, BLUE, GREEN, RED]), { bankId: rig.bankId }),
  durationMs: 80,
  frames: [
    { rgba: rgbaOf(BLUE, BLUE, BLUE, BLUE), durationMs: 120 },
    { rgba: rgbaOf(GREEN, RED, GREEN, RED), durationMs: 200 },
  ],
  ...extra,
});

describe('sprite.import with several frames', () => {
  it('creates one frame per image with its duration and the colours of that image', () => {
    const rig = makeRig();
    succeed(execute(rig, [importStep(animated(rig))]));
    const sprite = spriteNamed(rig, 'walk');
    expect(sprite.frames.map((frame) => frame.durationMs)).toEqual([80, 120, 200]);
    expect(Object.keys(sprite.cels)).toHaveLength(3);
    const [first, second] = [pixelsOf(sprite, 0), pixelsOf(sprite, 1)];
    expect(new Set(second).size).toBe(1);
    expect(new Set(first).size).toBeGreaterThan(1);
  });

  it('keeps the first frame at the default duration when none is given', () => {
    const rig = makeRig();
    succeed(execute(rig, [importStep({ ...animated(rig), durationMs: undefined })]));
    expect(spriteNamed(rig, 'walk').frames.map((frame) => frame.durationMs)).toEqual([100, 120, 200]);
  });

  it('is one undo step and redo restores every frame', () => {
    const rig = makeRig();
    succeed(execute(rig, [importStep(animated(rig))]));
    succeed(undoLast(rig));
    expect(rig.engine.state().artwork.sprites.some((sprite) => sprite.name === 'walk')).toBe(false);
    succeed(redoLast(rig));
    expect(spriteNamed(rig, 'walk').frames).toHaveLength(3);
  });

  it('rejects a frame whose bytes do not match the image size', () => {
    const rig = makeRig();
    const options = animated(rig, { frames: [{ rgba: rgbaOf(BLUE), durationMs: 50 }] });
    expect(rejectionCode(rig, () => execute(rig, [importStep(options)]))).not.toBeNull();
  });

  it('rejects a duration outside the allowed range', () => {
    const rig = makeRig();
    const options = animated(rig, { frames: [{ rgba: rgbaOf(BLUE, BLUE, BLUE, BLUE), durationMs: 0 }] });
    expect(rejectionCode(rig, () => execute(rig, [importStep(options)]))).not.toBeNull();
  });
});
