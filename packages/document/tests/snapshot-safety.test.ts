/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { documentId, heartEngine, patchStep, request } from './heart-engine';
import { snapshotProject } from './snapshot-project';

describe('snapshot safety', () => {
  it('keeps a held state intact through 50 strokes, undo and redo', () => {
    const { engine } = heartEngine();
    const held = engine.state();
    const heldSnapshot = snapshotProject(held.project);

    for (let index = 0; index < 50; index += 1) {
      const result = engine.execute(request([patchStep((index % 6) + 1)], { baseRevision: engine.state().revision }));
      expect(result.ok).toBe(true);
    }
    expect(engine.state().revision).toBe(51);
    expect(snapshotProject(held.project)).toBe(heldSnapshot);
    expect(snapshotProject(engine.state().project)).not.toBe(heldSnapshot);

    while (engine.canUndo()) engine.undo({ documentId, expectedRevision: engine.state().revision });
    expect(snapshotProject(engine.state().project)).toBe(heldSnapshot);
    expect(snapshotProject(held.project)).toBe(heldSnapshot);
  });

  it('never writes a committed buffer: each commit copies the touched cels', () => {
    const { engine } = heartEngine();
    const first = engine.state().project.sprites.flatMap((sprite) => Object.values(sprite.cels));
    engine.execute(request([patchStep(6)]));
    const second = engine.state().project.sprites.flatMap((sprite) => Object.values(sprite.cels));
    const firstBuffers = new Set(first.map((cel) => cel.pixels));
    const reused = second.filter((cel) => firstBuffers.has(cel.pixels));
    expect(reused).toHaveLength(1);
  });
});
