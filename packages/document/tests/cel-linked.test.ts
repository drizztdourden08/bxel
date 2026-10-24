/* @layer core @kind test */
import { counterIdSource, createEngine, defineCommand, documentCommands, writableCel } from '@bxel/document';
import type { Engine } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { fixtureToArtwork } from './fixture-to-artwork';
import { FRAME, WALKER, byIndex, celAt, frameEngine, named, patchOptions, scopedStep } from './frame-engine';
import { frameFixture } from './frame-fixture';
import { documentId } from './heart-engine';
import { apply, celPixels, expectUndoRedo, layerStep, rejection, sprite } from './layer-engine';

const slot = (layer: string, frame: number) => ({ layer: named(layer), frame: byIndex(frame) });
const bodyFrame = (id: string) => ({ layers: { by: 'names', names: ['Body'] }, frames: { by: 'ids', ids: [id] } }) as never;
const bodyAll = { layers: { by: 'names', names: ['Body'] }, frames: { by: 'all' } } as const;
const touch = defineCommand({
  name: 'test.touch',
  scope: 'cels',
  schema: z.strictObject({}),
  run: (draft, input) => {
    for (const { spriteId, celId } of input.cels) {
      if (celId) writableCel(draft, spriteId, celId)[15] = 1;
    }
  },
});

const touchEngine = (): Engine =>
  createEngine({
    state: { documentId, revision: 1, artwork: fixtureToArtwork(frameFixture), readOnly: false },
    ids: counterIdSource(500),
    commands: [...documentCommands, touch],
  });

const lastPixel = (engine: ReturnType<typeof frameEngine>, celId: string | undefined): number | undefined =>
  celPixels(engine, celId)?.[15];

describe('cel.link', () => {
  it('points two slots at one cel as one undo step', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('cel.link', { from: slot('Body', 2), to: slot('Fx', 2) }));
    expect(celAt(engine, 'Fx', FRAME[2])).toBe('cel_000121');
    expect(celAt(engine, 'Body', FRAME[2])).toBe('cel_000121');
  });

  it('replaces the destination cel and drops it when nothing else uses it', () => {
    const engine = frameEngine();
    apply(engine, layerStep('cel.link', { from: slot('Body', 3), to: slot('Fx', 0) }));
    expect(sprite(engine).cels).not.toHaveProperty('cel_000123');
  });

  it('makes a cel for an empty source first', () => {
    const engine = frameEngine();
    apply(engine, layerStep('cel.link', { from: slot('Fx', 2), to: slot('Fx', 3) }));
    const made = celAt(engine, 'Fx', FRAME[2]);
    expect(made).toBeDefined();
    expect(celAt(engine, 'Fx', FRAME[3])).toBe(made);
    expect(celPixels(engine, made)).toEqual(new Uint8Array(16));
  });

  it('does nothing when the slots already share a cel', () => {
    const engine = frameEngine();
    expect(apply(engine, layerStep('cel.link', { from: slot('Body', 0), to: slot('Body', 1) })).noop).toBe(true);
  });

  it('refuses a locked destination', () => {
    expect(rejection(frameEngine(), layerStep('cel.link', { from: slot('Body', 0), to: slot('Frozen', 1) })).code).toBe('LAYER_LOCKED');
  });
});

describe('painting a linked cel', () => {
  it('refuses one frame of a linked cel and changes nothing', () => {
    const error = rejection(frameEngine(), scopedStep('pixels.patch', patchOptions(3), bodyFrame(FRAME[0])));
    expect(error.code).toBe('CEL_LINKED');
    expect(error.details[0]).toMatchObject({ spriteId: WALKER, frameId: FRAME[0] });
  });

  it('allows it with allUses and changes every use', () => {
    const engine = frameEngine();
    apply(engine, scopedStep('pixels.patch', patchOptions(3, { allUses: true }), bodyFrame(FRAME[0])));
    expect(lastPixel(engine, 'cel_000120')).toBe(3);
    expect(celAt(engine, 'Body', FRAME[1])).toBe('cel_000120');
  });

  it('allows it when the scope reaches every use of the cel', () => {
    const engine = frameEngine();
    apply(engine, scopedStep('pixels.patch', patchOptions(3), { ...bodyAll, frames: { by: 'range', from: 0, to: 1 } }));
    expect(lastPixel(engine, 'cel_000120')).toBe(3);
  });

  it('refuses any other cel command that writes a linked cel, as the raster commands do', () => {
    const engine = touchEngine();
    const step = scopedStep('test.touch', {}, bodyFrame(FRAME[1]));
    expect(rejection(engine, step).code).toBe('CEL_LINKED');
    apply(engine, scopedStep('test.touch', {}, { ...bodyAll, frames: { by: 'range', from: 0, to: 1 } }));
    expect(lastPixel(engine, 'cel_000120')).toBe(1);
  });

  it('paints one frame after an unlink', () => {
    const engine = frameEngine();
    apply(engine, scopedStep('cel.unlink', {}, bodyFrame(FRAME[0])));
    apply(engine, scopedStep('pixels.patch', patchOptions(3), bodyFrame(FRAME[0])));
    expect(lastPixel(engine, celAt(engine, 'Body', FRAME[0]))).toBe(3);
    expect(lastPixel(engine, celAt(engine, 'Body', FRAME[1]))).toBe(0);
  });

  it('paints a plain cel without an option', () => {
    const engine = frameEngine();
    apply(engine, scopedStep('pixels.patch', patchOptions(3), bodyFrame(FRAME[3])));
    expect(lastPixel(engine, 'cel_000122')).toBe(3);
  });
});

describe('cel.unlink', () => {
  it('gives the slot its own copy of the pixels as one undo step', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, scopedStep('cel.unlink', {}, bodyFrame(FRAME[1])));
    const own = celAt(engine, 'Body', FRAME[1]);
    expect(own).not.toBe('cel_000120');
    expect(celPixels(engine, own)).toEqual(celPixels(engine, 'cel_000120'));
    expect(celAt(engine, 'Body', FRAME[0])).toBe('cel_000120');
  });

  it('leaves a cel that is not linked alone', () => {
    const engine = frameEngine();
    expect(apply(engine, scopedStep('cel.unlink', {}, bodyFrame(FRAME[3]))).noop).toBe(true);
  });

  it('unlinks every slot of a linked cel in one step', () => {
    const engine = frameEngine();
    apply(engine, scopedStep('cel.unlink', {}, { ...bodyAll, frames: { by: 'range', from: 0, to: 1 } }));
    expect(celAt(engine, 'Body', FRAME[0])).not.toBe(celAt(engine, 'Body', FRAME[1]));
  });
});
