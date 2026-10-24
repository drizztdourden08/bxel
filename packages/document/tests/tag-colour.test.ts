/* @layer core @kind test */
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { strFromU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { byIndex, frameEngine, named } from './frame-engine';
import { apply, expectUndoRedo, layerStep, rejection, sprite } from './layer-engine';
import { documentId } from './heart-engine';
import { artworkOf, fixedClock } from './native-fixture';

const colourOf = (engine: ReturnType<typeof frameEngine>, name: string): string | undefined =>
  sprite(engine).tags.find((tag) => tag.name === name)?.colour;

const documentText = (bytes: Uint8Array): string => strFromU8(unzipSync(bytes)['document.json'] ?? new Uint8Array());

const save = (engine: ReturnType<typeof frameEngine>): Uint8Array => encodeArtwork(engine.state(), null, fixedClock);

describe('tag colour in commands', () => {
  it('adds a tag with a colour, lowercases it and undoes it', () => {
    const engine = frameEngine();
    const step = layerStep('tag.add', { name: 'jump', from: byIndex(0), to: byIndex(1), colour: '#3B82F6' });
    expectUndoRedo(engine, step);
    expect(colourOf(engine, 'jump')).toBe('#3b82f6');
  });

  it('adds a tag with no colour key when none is given', () => {
    const engine = frameEngine();
    apply(engine, layerStep('tag.add', { name: 'plain', from: byIndex(0), to: byIndex(0) }));
    expect(Object.keys(sprite(engine).tags.at(-1) ?? {})).not.toContain('colour');
  });

  it('sets, changes and clears a colour with undo', () => {
    const engine = frameEngine();
    expectUndoRedo(engine, layerStep('tag.update', { tag: named('run'), colour: '#ef4444' }));
    apply(engine, layerStep('tag.update', { tag: named('run'), colour: '#22c55e' }));
    expect(colourOf(engine, 'run')).toBe('#22c55e');
    apply(engine, layerStep('tag.update', { tag: named('run'), colour: null }));
    expect(Object.keys(sprite(engine).tags[0] ?? {})).not.toContain('colour');
    engine.undo({ documentId, expectedRevision: engine.state().revision });
    expect(colourOf(engine, 'run')).toBe('#22c55e');
  });

  it('keeps the colour when other fields change', () => {
    const engine = frameEngine();
    apply(engine, layerStep('tag.update', { tag: named('run'), colour: '#ef4444' }));
    apply(engine, layerStep('tag.update', { tag: named('run'), direction: 'reverse' }));
    expect(colourOf(engine, 'run')).toBe('#ef4444');
  });

  it('refuses a colour that is not a six digit hex', () => {
    const engine = frameEngine();
    for (const colour of ['red', '#fff', '#12345g', 7]) {
      expect(rejection(engine, layerStep('tag.update', { tag: named('run'), colour })).code).toBe('INVALID_OPTION');
    }
    expect(rejection(engine, layerStep('tag.add', { name: 'x', from: byIndex(0), to: byIndex(0), colour: 'blue' })).code).toBe('INVALID_OPTION');
  });
});

describe('tag colour in the native file', () => {
  it('reads an old file with no colours and gives its tags no colour key', () => {
    const engine = frameEngine();
    const bytes = save(engine);
    expect(documentText(bytes)).not.toContain('colour');
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('ok');
    const tags = artworkOf(report).sprites.flatMap((item) => item.tags);
    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) expect(Object.keys(tag)).not.toContain('colour');
  });

  it('round trips a colour', () => {
    const engine = frameEngine();
    apply(engine, layerStep('tag.update', { tag: named('run'), colour: '#a855f7' }));
    const report = decodeArtwork(save(engine));
    expect(report.outcome).toBe('ok');
    const restored = artworkOf(report).sprites.flatMap((item) => item.tags).find((tag) => tag.name === 'run');
    expect(restored?.colour).toBe('#a855f7');
    const plain = artworkOf(report).sprites.flatMap((item) => item.tags).find((tag) => tag.name === 'idle');
    expect(Object.keys(plain ?? {})).not.toContain('colour');
  });

  it('writes the original bytes again after a colour is set and cleared', () => {
    const engine = frameEngine();
    const before = save(engine);
    apply(engine, layerStep('tag.update', { tag: named('run'), colour: '#a855f7' }));
    apply(engine, layerStep('tag.update', { tag: named('run'), colour: null }));
    expect(documentText(save(engine))).toBe(documentText(before));
  });
});
