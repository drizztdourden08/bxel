/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { request } from './heart-engine';
import { FRAME, SINGLE, WALKER, byId, byIndex, celAt as layerCel, frameEngine, frameIds, tagSpans } from './frame-engine';
import { apply, celPixels, expectUndoRedo, layerStep, rejection, sprite } from './layer-engine';

describe('frame.add', () => {
  it('adds an empty 100 ms frame after a frame as one undo step', () => {
    const engine = frameEngine();
    const step = layerStep('frame.add', { after: byIndex(1) }, [WALKER], 'made');
    expectUndoRedo(engine, step);
    const added = frameIds(engine)[2];
    expect(frameIds(engine)).toHaveLength(5);
    expect(sprite(engine).frames[2]).toMatchObject({ durationMs: 100 });
    expect(sprite(engine).layers.every((layer) => !(added as string in layer.cels))).toBe(true);
  });

  it('appends when no frame is named and reports the id by ref', () => {
    const engine = frameEngine();
    const result = apply(engine, layerStep('frame.add', { durationMs: 40 }, [WALKER], 'made'));
    expect(frameIds(engine).at(-1)).toBe(result.created.made);
    expect(sprite(engine).frames.at(-1)?.durationMs).toBe(40);
  });

  it('copies the cels of a frame into new cels', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.add', { after: byId(FRAME[2]), copyOf: byId(FRAME[2]) }));
    const added = frameIds(engine)[3] ?? '';
    const body = layerCel(engine, 'Body', added) ?? '';
    expect(body).not.toBe(layerCel(engine, 'Body', FRAME[2]));
    expect(celPixels(engine, body)).toEqual(celPixels(engine, layerCel(engine, 'Body', FRAME[2])));
    expect(sprite(engine).frames[3]?.durationMs).toBe(150);
  });

  it('shares the cels of a linked copy', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.add', { after: byIndex(3), copyOf: byIndex(0), linked: true }));
    const added = frameIds(engine)[4] ?? '';
    expect(layerCel(engine, 'Body', added)).toBe('cel_000120');
    expect(layerCel(engine, 'Fx', added)).toBe('cel_000123');
  });

  it('rejects bad durations and unknown frames without a change', () => {
    expect(rejection(frameEngine(), layerStep('frame.add', { durationMs: 0 })).code).toBe('INVALID_OPTION');
    expect(rejection(frameEngine(), layerStep('frame.add', { durationMs: 65536 })).code).toBe('INVALID_OPTION');
    expect(rejection(frameEngine(), layerStep('frame.add', { after: byIndex(9) })).code).toBe('TARGET_NOT_FOUND');
  });
});

describe('preview', () => {
  it('equals commit for a frame copy and leaves the artwork alone', () => {
    const previewed = frameEngine();
    const step = layerStep('frame.duplicate', { frame: byIndex(0) }, [WALKER], 'copy');
    const before = canonicalArtwork(previewed.state().artwork);
    const preview = previewed.execute(request([step], { mode: 'preview' }));
    expect(canonicalArtwork(previewed.state().artwork)).toBe(before);
    expect(previewed.state().revision).toBe(1);
    const committed = apply(previewed, step);
    const direct = frameEngine();
    const alone = apply(direct, step);
    expect(preview.ok && preview.created).toEqual(committed.created);
    expect(committed.created).toEqual(alone.created);
    expect(preview.ok && preview.changes).toEqual(committed.changes);
    expect(canonicalArtwork(previewed.state().artwork)).toBe(canonicalArtwork(direct.state().artwork));
  });
});

describe('frame.duplicate', () => {
  it('copies the frame and its duration right after it', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('frame.duplicate', { frame: byIndex(1) }));
    expect(sprite(engine).frames.map((frame) => frame.durationMs)).toEqual([100, 200, 200, 150, 50]);
    expect(layerCel(engine, 'Body', frameIds(engine)[2] ?? '')).not.toBe('cel_000120');
  });

  it('keeps the new cels apart from the originals', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.duplicate', { frame: byIndex(2) }));
    const copy = layerCel(engine, 'Body', frameIds(engine)[3] ?? '') ?? '';
    expect(celPixels(engine, copy)).toEqual(celPixels(engine, 'cel_000121'));
    expect(copy).not.toBe('cel_000121');
  });

  it('works across sprites by position', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.duplicate', { frame: byIndex(0), durationMs: 70 }, [WALKER, SINGLE]));
    expect(frameIds(engine, SINGLE)).toHaveLength(2);
    expect(sprite(engine, SINGLE).frames[1]?.durationMs).toBe(70);
    expect(frameIds(engine)).toHaveLength(5);
  });
});

describe('frame.delete', () => {
  it('removes the frame, its cel slots and the cels nobody uses', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('frame.delete', { frame: byId(FRAME[2]) }));
    expect(frameIds(engine)).toEqual([FRAME[0], FRAME[1], FRAME[3]]);
    expect(sprite(engine).cels).not.toHaveProperty('cel_000121');
    expect(Object.keys(sprite(engine).layers[0]?.cels ?? {})).toEqual([FRAME[0], FRAME[1], FRAME[3]]);
  });

  it('keeps a linked cel that another frame still uses', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.delete', { frame: byIndex(0) }));
    expect(sprite(engine).cels).toHaveProperty('cel_000120');
    expect(sprite(engine).cels).not.toHaveProperty('cel_000123');
  });

  it('pulls a tag in when its first or last frame goes', () => {
    const engine = frameEngine();
    apply(engine, layerStep('frame.delete', { frame: byIndex(0) }));
    expect(tagSpans(engine)).toEqual([`run:${FRAME[1]}-${FRAME[2]}`, `idle:${FRAME[1]}-${FRAME[1]}`, `tail:${FRAME[2]}-${FRAME[3]}`]);
    apply(engine, layerStep('frame.delete', { frame: byIndex(2) }));
    expect(tagSpans(engine)).toEqual([`run:${FRAME[1]}-${FRAME[2]}`, `idle:${FRAME[1]}-${FRAME[1]}`, `tail:${FRAME[2]}-${FRAME[2]}`]);
  });

  it('removes a tag that covered only the deleted frame and warns', () => {
    const engine = frameEngine();
    const result = apply(engine, layerStep('frame.delete', { frame: byIndex(1) }));
    expect(tagSpans(engine)).toEqual([`run:${FRAME[0]}-${FRAME[2]}`, `tail:${FRAME[2]}-${FRAME[3]}`]);
    expect(result.warnings.map((warning) => warning.code)).toEqual(['TAG_REMOVED']);
    expect(engine.undo({ documentId: engine.documentId, expectedRevision: engine.state().revision }).ok).toBe(true);
    expect(sprite(engine).tags).toHaveLength(3);
  });

  it('keeps at least one frame', () => {
    const error = rejection(frameEngine(), layerStep('frame.delete', { frame: byIndex(0) }, [SINGLE]));
    expect(error.code).toBe('LAST_FRAME');
    expect(error.details[0]?.spriteId).toBe(SINGLE);
  });

  it('fails the whole step when one sprite would lose its last frame', () => {
    const engine = frameEngine();
    expect(rejection(engine, layerStep('frame.delete', { frame: byIndex(0) }, [WALKER, SINGLE])).code).toBe('LAST_FRAME');
    expect(frameIds(engine)).toHaveLength(4);
  });
});
