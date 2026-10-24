/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { FRAME, SINGLE, WALKER, byId, byIndex, frameEngine, named, tagSpans } from './frame-engine';
import { apply, expectUndoRedo, layerStep, rejection, sprite } from './layer-engine';

describe('tag.add', () => {
  it('adds a tag over two frames as one undo step and reports its id by ref', () => {
    const engine = frameEngine();
    const step = layerStep('tag.add', { name: 'jump', from: byIndex(1), to: byId(FRAME[3]), direction: 'pingpong', repeat: 3 }, [WALKER], 'made');
    expectUndoRedo(engine, step);
    const result = apply(engine, layerStep('tag.add', { name: 'again', from: byIndex(0), to: byIndex(0) }, [WALKER], 'again'));
    expect(sprite(engine).tags.at(-1)).toMatchObject({ name: 'again', direction: 'forward', repeat: 0, from: FRAME[0], to: FRAME[0] });
    expect(sprite(engine).tags.at(-1)?.id).toBe(result.created.again);
  });

  it('keeps the options of the new tag', () => {
    const engine = frameEngine();
    apply(engine, layerStep('tag.add', { name: 'jump', from: byIndex(1), to: byIndex(3), direction: 'reverse', repeat: 4 }));
    expect(sprite(engine).tags.at(-1)).toMatchObject({ name: 'jump', from: FRAME[1], to: FRAME[3], direction: 'reverse', repeat: 4 });
  });

  it('refuses a taken name in any letter case', () => {
    const step = layerStep('tag.add', { name: 'RUN', from: byIndex(0), to: byIndex(1) });
    expect(rejection(frameEngine(), step).code).toBe('NAME_TAKEN');
  });

  it('refuses a blank name, a backwards span and a missing frame', () => {
    const engine = frameEngine();
    expect(rejection(engine, layerStep('tag.add', { name: ' ', from: byIndex(0), to: byIndex(1) })).code).toBe('NAME_INVALID');
    expect(rejection(engine, layerStep('tag.add', { name: 'x', from: byIndex(2), to: byIndex(1) })).code).toBe('INVALID_OPTION');
    expect(rejection(engine, layerStep('tag.add', { name: 'x', from: byIndex(0), to: byIndex(8) })).code).toBe('TARGET_NOT_FOUND');
  });

  it('refuses an unknown direction and a negative repeat', () => {
    const engine = frameEngine();
    expect(rejection(engine, layerStep('tag.add', { name: 'x', from: byIndex(0), to: byIndex(1), direction: 'sideways' })).code).toBe('INVALID_OPTION');
    expect(rejection(engine, layerStep('tag.add', { name: 'x', from: byIndex(0), to: byIndex(1), repeat: -1 })).code).toBe('INVALID_OPTION');
  });

  it('adds the same tag to several sprites by frame position', () => {
    const engine = frameEngine();
    apply(engine, layerStep('tag.add', { name: 'whole', from: byIndex(0), to: byIndex(0) }, [WALKER, SINGLE]));
    expect(sprite(engine, SINGLE).tags.map((tag) => tag.name)).toEqual(['whole']);
  });
});

describe('tag.update', () => {
  it('changes name, span, direction and repeat as one undo step', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('tag.update', { tag: named('RUN'), name: 'sprint', from: byIndex(1), to: byIndex(3), direction: 'forward', repeat: 0 }));
    expect(sprite(engine).tags[0]).toMatchObject({ name: 'sprint', from: FRAME[1], to: FRAME[3], direction: 'forward', repeat: 0 });
  });

  it('keeps the fields it was not given', () => {
    const engine = frameEngine();
    apply(engine, layerStep('tag.update', { tag: named('run'), to: byId(FRAME[3]) }));
    expect(sprite(engine).tags[0]).toMatchObject({ name: 'run', from: FRAME[0], to: FRAME[3], direction: 'pingpong', repeat: 2 });
  });

  it('allows a tag to keep its own name in another letter case', () => {
    const engine = frameEngine();
    apply(engine, layerStep('tag.update', { tag: named('run'), name: 'RUN' }));
    expect(sprite(engine).tags[0]?.name).toBe('RUN');
  });

  it('refuses a name another tag has, a span that runs backwards and an empty update', () => {
    const engine = frameEngine();
    expect(rejection(engine, layerStep('tag.update', { tag: named('run'), name: 'Idle' })).code).toBe('NAME_TAKEN');
    expect(rejection(engine, layerStep('tag.update', { tag: named('run'), from: byIndex(3) })).code).toBe('INVALID_OPTION');
    expect(rejection(engine, layerStep('tag.update', { tag: named('run') })).code).toBe('INVALID_OPTION');
  });

  it('reports a missing tag', () => {
    expect(rejection(frameEngine(), layerStep('tag.update', { tag: named('nope'), repeat: 1 })).code).toBe('TARGET_NOT_FOUND');
  });
});

describe('tag.delete', () => {
  it('removes a tag by name or id as one undo step', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('tag.delete', { tag: named('idle') }));
    expect(tagSpans(engine)).toEqual([`run:${FRAME[0]}-${FRAME[2]}`, `tail:${FRAME[2]}-${FRAME[3]}`]);
    apply(engine, layerStep('tag.delete', { tag: byId('tag_000130') }));
    expect(sprite(engine).tags.map((tag) => tag.name)).toEqual(['tail']);
  });

  it('reports a missing tag and lists the sprites that lack it', () => {
    expect(rejection(frameEngine(), layerStep('tag.delete', { tag: named('nope') })).code).toBe('TARGET_NOT_FOUND');
    const error = rejection(frameEngine(), layerStep('tag.delete', { tag: named('run') }, [WALKER, SINGLE]));
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
    expect(error.details.map((issue) => issue.spriteId)).toEqual([SINGLE]);
  });
});
