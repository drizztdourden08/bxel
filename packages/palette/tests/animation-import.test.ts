/* @layer tests @kind test */
import type { Animation, Sprite } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { redoLast, undoLast } from './import-helpers';
import { execute, makeRig, rejectionCode, step, succeed } from './palette-engine';

const RED = [176, 42, 156, 255] as const;
const BLUE = [75, 31, 160, 255] as const;
const GREEN = [123, 63, 228, 255] as const;
const CLEAR = [0, 0, 0, 0] as const;

const rgbaOf = (...pixels: (readonly number[])[]): Uint8Array => Uint8Array.from(pixels.flat());

const importOptions = (rig: ReturnType<typeof makeRig>, extra: object = {}): object => ({
  name: 'walk',
  width: 2,
  height: 2,
  bank: { bankId: rig.bankId },
  frames: [
    { rgba: rgbaOf(RED, BLUE, GREEN, RED), durationMs: 80 },
    { rgba: rgbaOf(BLUE, BLUE, BLUE, BLUE), durationMs: 120 },
    { rgba: rgbaOf(CLEAR, CLEAR, CLEAR, CLEAR), durationMs: 200 },
  ],
  ...extra,
});

const run = (rig: ReturnType<typeof makeRig>, options: object) => execute(rig, [{ ...step('animation.import', options), ref: 'made' }]);

const animationNamed = (rig: ReturnType<typeof makeRig>, name: string): Animation => {
  const found = rig.engine.state().artwork.animations.find((animation) => animation.name === name);
  if (!found) throw new Error(`animation ${name} is missing`);
  return found;
};

const frameSprite = (rig: ReturnType<typeof makeRig>, animation: Animation, at: number): Sprite => {
  const id = animation.frames[at]?.spriteId;
  const sprite = rig.engine.state().artwork.sprites.find((candidate) => candidate.id === id);
  if (!sprite) throw new Error(`frame ${at} has no sprite`);
  return sprite;
};

describe('animation.import', () => {
  it('creates one animation with an owned frame sprite and a duration for every picture', () => {
    const rig = makeRig();
    const done = succeed(run(rig, importOptions(rig)));
    const walk = animationNamed(rig, 'walk');
    expect(done.ok && done.created['made']).toBe(walk.id);
    expect(walk.frames.map((frame) => frame.durationMs)).toEqual([80, 120, 200]);
    expect([walk.width, walk.height]).toEqual([2, 2]);
    const sprites = walk.frames.map((_frame, at) => frameSprite(rig, walk, at));
    expect(sprites.map((sprite) => sprite.role)).toEqual(['frame', 'frame', 'frame']);
    expect(sprites.every((sprite) => sprite.frames.length === 1)).toBe(true);
  });

  it('maps the colours of every picture and leaves a clear picture without a cel', () => {
    const rig = makeRig();
    succeed(run(rig, importOptions(rig)));
    const walk = animationNamed(rig, 'walk');
    const [first, second, clear] = walk.frames.map((_frame, at) => frameSprite(rig, walk, at));
    expect(Object.keys(first?.cels ?? {})).toHaveLength(1);
    expect(new Set(Object.values(second?.cels ?? {})[0]?.pixels).size).toBe(1);
    expect(Object.keys(clear?.cels ?? {})).toHaveLength(0);
  });

  it('is one undo step and redo brings the whole animation back', () => {
    const rig = makeRig();
    succeed(run(rig, importOptions(rig)));
    succeed(undoLast(rig));
    expect(rig.engine.state().artwork.animations).toHaveLength(0);
    expect(rig.engine.state().artwork.sprites.some((sprite) => sprite.role === 'frame')).toBe(false);
    succeed(redoLast(rig));
    expect(animationNamed(rig, 'walk').frames).toHaveLength(3);
  });

  it('rejects a picture whose bytes do not match the size, and a duration out of range', () => {
    const rig = makeRig();
    const small = importOptions(rig, { frames: [{ rgba: rgbaOf(BLUE), durationMs: 50 }] });
    expect(rejectionCode(rig, () => run(rig, small))).not.toBeNull();
    const zero = importOptions(rig, { frames: [{ rgba: rgbaOf(BLUE, BLUE, BLUE, BLUE), durationMs: 0 }] });
    expect(rejectionCode(rig, () => run(rig, zero))).not.toBeNull();
  });
});
