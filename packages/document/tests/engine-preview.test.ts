/* @layer core @kind test */
import type { CommandStep, TransactionResult } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { heartEngine, request } from './heart-engine';
import { snapshotProject } from './snapshot-project';

const createStep: CommandStep = {
  name: 'sprite.create',
  targets: null,
  options: { name: 'fresh', width: 4, height: 4 },
  ref: 'fresh',
};

const paintStep: CommandStep = {
  name: 'pixels.patch',
  targets: { sprites: [{ ref: 'fresh' }], layers: { by: 'all' }, frames: { by: 'all' } },
  options: { rect: { x: 1, y: 1, width: 2, height: 1 }, pixels: new Uint8Array([3, 4]) },
};

const createAndPaint = [createStep, paintStep];

const okOf = (result: TransactionResult) => {
  if (!result.ok) throw new Error(result.error.message);
  return result;
};

describe('preview', () => {
  it('equals commit, including ids from the counter source', () => {
    const previewed = heartEngine();
    const preview = okOf(previewed.engine.execute(request(createAndPaint, { mode: 'preview', previewPixels: 64 })));
    const before = snapshotProject(previewed.engine.state().project);
    expect(previewed.engine.state().revision).toBe(1);
    const committed = okOf(previewed.engine.execute(request(createAndPaint)));

    const direct = heartEngine();
    const alone = okOf(direct.engine.execute(request(createAndPaint)));

    expect(committed.created).toEqual(preview.created);
    expect(committed.created).toEqual(alone.created);
    expect(committed.created['fresh']).toBe('spr_000100');
    expect(committed.changes).toEqual(preview.changes);
    expect(snapshotProject(previewed.engine.state().project)).toBe(snapshotProject(direct.engine.state().project));
    expect(snapshotProject(previewed.engine.state().project)).not.toBe(before);
  });

  it('leaves the revision, project and id source unchanged', () => {
    const { engine, ids } = heartEngine();
    const before = snapshotProject(engine.state().project);
    okOf(engine.execute(request(createAndPaint, { mode: 'preview' })));
    expect(engine.state().revision).toBe(1);
    expect(snapshotProject(engine.state().project)).toBe(before);
    expect(engine.canUndo()).toBe(false);
    expect(ids.next('spr')).toBe('spr_000100');
  });

  it('returns the pixels of a new cel within the preview budget', () => {
    const { engine } = heartEngine();
    const preview = okOf(engine.execute(request(createAndPaint, { mode: 'preview', previewPixels: 64 })));
    expect(preview.preview?.truncated).toBe(false);
    const cel = preview.preview?.cels[0];
    expect(cel?.rect).toEqual({ x: 0, y: 0, width: 4, height: 4 });
    const expected = new Array<number>(16).fill(0);
    expected[5] = 3;
    expected[6] = 4;
    expect(Array.from(cel?.pixels ?? [])).toEqual(expected);
    const tight = okOf(engine.execute(request(createAndPaint, { mode: 'preview', previewPixels: 1 })));
    expect(tight.preview?.truncated).toBe(true);
  });

  it('creates a sprite and its cel in one undo step', () => {
    const { engine } = heartEngine();
    const before = snapshotProject(engine.state().project);
    const result = okOf(engine.execute(request(createAndPaint)));
    expect(Object.keys(result.created)).toEqual(['fresh']);
    expect(engine.state().project.sprites).toHaveLength(3);
    const after = snapshotProject(engine.state().project);
    engine.undo({ documentId: engine.documentId, expectedRevision: 2 });
    expect(snapshotProject(engine.state().project)).toBe(before);
    engine.redo({ documentId: engine.documentId, expectedRevision: 3 });
    expect(snapshotProject(engine.state().project)).toBe(after);
  });

  it('rejects a ref used twice and a ref that was never made', () => {
    const { engine } = heartEngine();
    const other: CommandStep = { ...createStep, options: { name: 'other', width: 4, height: 4 } };
    const twice = engine.execute(request([createStep, other]));
    expect(twice.ok ? null : twice.error.code).toBe('INVALID_OPTION');
    const missing = engine.execute(request([paintStep]));
    expect(missing.ok ? null : missing.error.code).toBe('TARGET_NOT_FOUND');
    expect(engine.state().revision).toBe(1);
  });
});
