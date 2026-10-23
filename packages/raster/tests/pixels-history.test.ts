/* @layer tests @kind test */
import { readRect } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { heartIds, heartProject } from './heart-project';
import { documentId, pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { okOf, projectBytes } from './result-checks';

const stroke = (mode: 'commit' | 'preview' = 'commit') =>
  request(
    [
      stepOf('pixels.paint', scopeOf([heartIds.heart, heartIds.heartB], { by: 'names', names: ['Body'] }), {
        index: 5,
        points: [{ x: 1, y: 1 }, { x: 5, y: 3 }, { x: 6, y: 6 }],
        brush: { shape: 'circle', size: 3 },
        pixelPerfect: true,
      }),
    ],
    { mode, previewPixels: 4096 },
  );

describe('pixels.paint history', () => {
  test('one stroke is one undo step and redo restores the same bytes', () => {
    const engine = pixelEngine(heartProject());
    const original = projectBytes(engine.state().project);
    okOf(engine.execute(stroke()));
    const painted = projectBytes(engine.state().project);
    expect(painted).not.toEqual(original);
    expect(okOf(engine.undo({ documentId, expectedRevision: 2 })).revision).toBe(3);
    expect(projectBytes(engine.state().project)).toEqual(original);
    expect(engine.canUndo()).toBe(false);
    expect(okOf(engine.redo({ documentId, expectedRevision: 3 })).revision).toBe(4);
    expect(projectBytes(engine.state().project)).toEqual(painted);
  });

  test('never writes a committed buffer', () => {
    const engine = pixelEngine(heartProject());
    const base = engine.state().project;
    const original = projectBytes(base);
    okOf(engine.execute(stroke()));
    expect(projectBytes(base)).toEqual(original);
  });

  test('preview equals commit and changes nothing', () => {
    const previewed = pixelEngine(heartProject());
    const base = previewed.state().project;
    const preview = okOf(previewed.execute(stroke('preview')));
    expect(previewed.state().project).toBe(base);
    expect(previewed.state().revision).toBe(1);
    const committed = pixelEngine(heartProject());
    const commit = okOf(committed.execute(stroke()));
    expect(preview.changes).toEqual(commit.changes);
    expect(preview.preview?.truncated).toBe(false);
    for (const cel of preview.preview?.cels ?? []) {
      const sprite = committed.state().project.sprites.find((item) => item.cels[cel.celId]);
      const pixels = sprite?.cels[cel.celId]?.pixels;
      expect(pixels).toBeDefined();
      if (sprite && pixels) expect(cel.pixels).toEqual(readRect(pixels, sprite.width, cel.rect));
    }
    okOf(previewed.execute(stroke()));
    expect(projectBytes(previewed.state().project)).toEqual(projectBytes(committed.state().project));
  });
});
