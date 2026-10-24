/* @layer tests @kind test */
import { readRect } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { heartIds, heartArtwork } from './heart-artwork';
import { documentId, pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { okOf, artworkBytes } from './result-checks';

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
    const engine = pixelEngine(heartArtwork());
    const original = artworkBytes(engine.state().artwork);
    okOf(engine.execute(stroke()));
    const painted = artworkBytes(engine.state().artwork);
    expect(painted).not.toEqual(original);
    expect(okOf(engine.undo({ documentId, expectedRevision: 2 })).revision).toBe(3);
    expect(artworkBytes(engine.state().artwork)).toEqual(original);
    expect(engine.canUndo()).toBe(false);
    expect(okOf(engine.redo({ documentId, expectedRevision: 3 })).revision).toBe(4);
    expect(artworkBytes(engine.state().artwork)).toEqual(painted);
  });

  test('never writes a committed buffer', () => {
    const engine = pixelEngine(heartArtwork());
    const base = engine.state().artwork;
    const original = artworkBytes(base);
    okOf(engine.execute(stroke()));
    expect(artworkBytes(base)).toEqual(original);
  });

  test('preview equals commit and changes nothing', () => {
    const previewed = pixelEngine(heartArtwork());
    const base = previewed.state().artwork;
    const preview = okOf(previewed.execute(stroke('preview')));
    expect(previewed.state().artwork).toBe(base);
    expect(previewed.state().revision).toBe(1);
    const committed = pixelEngine(heartArtwork());
    const commit = okOf(committed.execute(stroke()));
    expect(preview.changes).toEqual(commit.changes);
    expect(preview.preview?.truncated).toBe(false);
    for (const cel of preview.preview?.cels ?? []) {
      const sprite = committed.state().artwork.sprites.find((item) => item.cels[cel.celId]);
      const pixels = sprite?.cels[cel.celId]?.pixels;
      expect(pixels).toBeDefined();
      if (sprite && pixels) expect(cel.pixels).toEqual(readRect(pixels, sprite.width, cel.rect));
    }
    okOf(previewed.execute(stroke()));
    expect(artworkBytes(previewed.state().artwork)).toEqual(artworkBytes(committed.state().artwork));
  });
});
