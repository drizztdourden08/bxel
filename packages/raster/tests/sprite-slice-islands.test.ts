/* @layer tests @kind test */
import type { SpriteId } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { brand } from './brand';
import { buildArtwork } from './build-artwork';
import { applyTo, frameRows, named, names, refusal, undoLast } from './compose-world';
import { pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { errorOf } from './result-checks';
import { findIslands } from '../src/commands/compose/find-islands';

const sheet = brand<SpriteId>('spr_000100');

const NINE = ['11.11.11', '11.11.11', '........', '11.11.11', '11.11.11', '........', '11.11.11', '11.11.11'];

const artworkOf = (rows: readonly string[]) =>
  buildArtwork([
    {
      id: 'spr_000100',
      name: 'blobs',
      width: rows[0]?.length ?? 1,
      height: rows.length,
      frames: ['frm_000102'],
      layers: [{ id: 'lay_000101', name: 'Body', cels: { frm_000102: 'cel_000103' } }],
      cels: { cel_000103: rows },
    },
  ]);

const engineOf = (rows: readonly string[]) => pixelEngine(artworkOf(rows));

describe('K2 findIslands', { tags: ['critical'] }, () => {
  test('finds nine islands in reading order', () => {
    const sprite = artworkOf(NINE).sprites[0];
    if (!sprite) throw new Error('no sprite');
    const boxes = findIslands(sprite, { minSize: 1, merge: 0 });
    expect(boxes).toHaveLength(9);
    expect(boxes.slice(0, 4).map((box) => [box.x, box.y])).toEqual([[0, 0], [3, 0], [6, 0], [0, 3]]);
    expect(boxes.every((box) => box.width === 2 && box.height === 2)).toBe(true);
  });

  test('joins pixels that touch on a diagonal, merges boxes within the distance and drops what is under the minimum', () => {
    const sprite = artworkOf(['1.....1', '.1.....', '.......', '...1...', '.......', '1.....1'].map((row) => row)).sprites[0];
    if (!sprite) throw new Error('no sprite');
    expect(findIslands(sprite, { minSize: 1, merge: 0 })).toHaveLength(5);
    expect(findIslands(sprite, { minSize: 2, merge: 0 })).toHaveLength(1);
    expect(findIslands(sprite, { minSize: 1, merge: 3 }).length).toBeLessThan(5);
  });
});

describe('K2 sprite.slice by islands', { tags: ['critical'] }, () => {
  test('cuts nine sprites in one undo step, each sized to its island', () => {
    const engine = engineOf(NINE);
    const before = engine.state().artwork;
    applyTo(engine, 'sprite.slice', [sheet], { islands: { minSize: 1, merge: 0 } });
    expect(names(engine)).toEqual(['blobs_1', 'blobs_2', 'blobs_3', 'blobs_4', 'blobs_5', 'blobs_6', 'blobs_7', 'blobs_8', 'blobs_9']);
    const first = named(engine, 'blobs_1');
    expect([first.width, first.height]).toEqual([2, 2]);
    expect(frameRows(first, 0, 0)).toEqual(['11', '11']);
    undoLast(engine);
    expect(engine.state().artwork).toEqual(before);
  });

  test('keeps the source on request and refuses a grid given with islands or an empty image', () => {
    const engine = engineOf(NINE);
    applyTo(engine, 'sprite.slice', [sheet], { islands: { minSize: 1, merge: 0 }, keep: true });
    expect(names(engine)[0]).toBe('blobs');
    expect(refusal(engineOf(NINE), 'sprite.slice', [sheet], { islands: { minSize: 1, merge: 0 }, columns: 2, rows: 2 })).toBe('INVALID_OPTION');
    expect(refusal(engineOf(['....', '....']), 'sprite.slice', [sheet], { islands: { minSize: 1, merge: 0 } })).toBe('INVALID_OPTION');
  });
});

describe('K2 sprite.slice when a piece name is already used', { tags: ['critical'] }, () => {
  const cutOnce = () => {
    const engine = engineOf(NINE);
    applyTo(engine, 'sprite.slice', [sheet], { islands: { minSize: 1, merge: 0 }, keep: true });
    return engine;
  };

  test('refuses by default, numbers the new pieces with keep and leaves the used names out with skip', () => {
    const again = cutOnce();
    const taken = errorOf(again.execute(request([stepOf('sprite.slice', scopeOf([sheet]), { islands: { minSize: 1, merge: 0 }, keep: true })], { baseRevision: again.state().revision })));
    expect(taken.code).toBe('NAME_TAKEN');
    const kept = cutOnce();
    applyTo(kept, 'sprite.slice', [sheet], { islands: { minSize: 1, merge: 0 }, keep: true, existing: 'keep' });
    expect(names(kept)).toContain('blobs_1_2');
    const skipped = cutOnce();
    const before = names(skipped).length;
    applyTo(skipped, 'sprite.slice', [sheet], { islands: { minSize: 1, merge: 0 }, keep: true, existing: 'skip' });
    expect(names(skipped)).toHaveLength(before);
  });
});
