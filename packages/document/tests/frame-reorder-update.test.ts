/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { FRAME, SINGLE, WALKER, byId, byIndex, celAt, frameEngine, frameIds, patchOptions, scopedStep, tagSpans } from './frame-engine';
import { apply, celPixels, expectUndoRedo, layerStep, rejection, sprite } from './layer-engine';

describe('frame.reorder', () => {
  it('moves a frame to a position as one undo step', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('frame.reorder', { frame: byId(FRAME[3]), to: 0 }));
    expect(frameIds(engine)).toEqual([FRAME[3], FRAME[0], FRAME[1], FRAME[2]]);
  });

  it('keeps tags on their frames and swaps an endpoint pair that now runs backwards', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.reorder', { frame: byId(FRAME[0]), to: 2 }));
    expect(frameIds(engine)).toEqual([FRAME[1], FRAME[2], FRAME[0], FRAME[3]]);
    expect(tagSpans(engine)).toEqual([`run:${FRAME[2]}-${FRAME[0]}`, `idle:${FRAME[1]}-${FRAME[1]}`, `tail:${FRAME[2]}-${FRAME[3]}`]);
  });

  it('leaves the tags alone when the order of their frames holds', () => {
    const engine = frameEngine();
    const before = sprite(engine).tags;
    apply(engine, layerStep('frame.reorder', { frame: byId(FRAME[3]), to: 3 }));
    apply(engine, layerStep('frame.reorder', { frame: byId(FRAME[1]), to: 1 }));
    expect(sprite(engine).tags).toBe(before);
  });

  it('keeps the cel slots with their frames', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.reorder', { frame: byId(FRAME[2]), to: 0 }));
    expect(celAt(engine, 'Body', FRAME[2])).toBe('cel_000121');
  });

  it('rejects a position past the last frame', () => {
    expect(rejection(frameEngine(), layerStep('frame.reorder', { frame: byIndex(0), to: 4 })).code).toBe('INDEX_OUT_OF_RANGE');
  });
});

describe('frame.update', () => {
  it('sets the duration as one undo step', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('frame.update', { frame: byIndex(2), durationMs: 65535 }));
    expect(sprite(engine).frames[2]?.durationMs).toBe(65535);
  });

  it('accepts the lowest duration and rejects the ones outside 1 to 65535', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.update', { frame: byIndex(0), durationMs: 1 }));
    expect(sprite(engine).frames[0]?.durationMs).toBe(1);
    expect(rejection(engine, layerStep('frame.update', { frame: byIndex(0), durationMs: 0 })).code).toBe('INVALID_OPTION');
    expect(rejection(engine, layerStep('frame.update', { frame: byIndex(0), durationMs: 65536 })).code).toBe('INVALID_OPTION');
    expect(rejection(engine, layerStep('frame.update', { frame: byIndex(0), durationMs: 12.5 })).code).toBe('INVALID_OPTION');
  });

  it('does nothing when the duration is the same', () => {
    const engine = frameEngine();
    const result = apply(engine, layerStep('frame.update', { frame: byIndex(0), durationMs: 100 }));
    expect(result.noop).toBe(true);
    expect(engine.canUndo()).toBe(false);
  });

  it('updates the same position in several sprites', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.update', { frame: byIndex(0), durationMs: 33 }, [WALKER, SINGLE]));
    expect(sprite(engine, SINGLE).frames[0]?.durationMs).toBe(33);
    expect(sprite(engine).frames[0]?.durationMs).toBe(33);
  });
});

describe('frame scopes after frame edits', () => {
  const patchedFrames = (engine: ReturnType<typeof frameEngine>): string[] =>
    sprite(engine)
      .frames.filter((frame) => {
        const cel = celAt(engine, 'Fx', frame.id);
        return cel !== undefined && celPixels(engine, cel)?.[15] === 3;
      })
      .map((frame) => frame.id);

  it('resolves a tag scope against the tag after a reorder', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.reorder', { frame: byId(FRAME[0]), to: 2 }));
    apply(engine, scopedStep('pixels.patch', patchOptions(3), { layers: { by: 'names', names: ['Fx'] }, frames: { by: 'tag', name: 'run' } }));
    expect(patchedFrames(engine)).toEqual([FRAME[2], FRAME[0]]);
  });

  it('resolves a range scope after a frame was added', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.add', { after: byIndex(0) }));
    apply(engine, scopedStep('pixels.patch', patchOptions(3), { layers: { by: 'names', names: ['Fx'] }, frames: { by: 'range', from: 1, to: 2 } }));
    expect(patchedFrames(engine)).toEqual([frameIds(engine)[1], frameIds(engine)[2]]);
  });

  it('resolves an ids scope after a frame was deleted and fails for the deleted id', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.delete', { frame: byIndex(1) }));
    const scope = { layers: { by: 'names', names: ['Fx'] } } as const;
    apply(engine, scopedStep('pixels.patch', patchOptions(3), { ...scope, frames: { by: 'ids', ids: [FRAME[3]] } }));
    expect(patchedFrames(engine)).toEqual([FRAME[3]]);
    const step = scopedStep('pixels.patch', patchOptions(3), { ...scope, frames: { by: 'ids', ids: [FRAME[1]] } });
    expect(rejection(engine, step).code).toBe('TARGET_NOT_FOUND');
  });

  it('finds the frames of a tag shrunk by a delete', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.delete', { frame: byIndex(0) }));
    apply(engine, scopedStep('pixels.patch', patchOptions(3), { layers: { by: 'names', names: ['Fx'] }, frames: { by: 'tag', name: 'run' } }));
    expect(patchedFrames(engine)).toEqual([FRAME[1], FRAME[2]]);
  });
});
