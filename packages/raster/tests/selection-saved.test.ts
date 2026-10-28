/* @layer tests @kind test */
import { sliceAsset } from '@bxel/document';
import { decodeSprite, encodeSprite } from '@bxel/document/native';
import { maskRuns, runsMask } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { errorOf, expectOneUndo, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { rowsIds, rowsArtwork } from './rows-artwork';

const ROWS = ['....', '.12.', '.34.', '....'];
const scope = scopeOf([rowsIds.sprite]);
const save = (name: string, mask: unknown) => stepOf('selection.save', scope, { name, mask });
const savedOf = (engine: ReturnType<typeof pixelEngine>) => engine.state().artwork.sprites[0]?.selections;
const next = (engine: ReturnType<typeof pixelEngine>, step: ReturnType<typeof save>) => request([step], { baseRevision: engine.state().revision });
const BLOCK = maskFromRows(['....', '.##.', '.##.', '....']);

describe('saved selections', () => {
  test('runs and masks convert both ways', () => {
    expect(maskRuns(BLOCK)).toEqual([[1, 1, 2], [2, 1, 2]]);
    expect(runsMask(BLOCK, maskRuns(BLOCK)).bits).toEqual(BLOCK.bits);
  });

  test('selection.save keeps the mask by name as one undo step, and replaces the same name', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    const original = engine.state().artwork;
    okOf(engine.execute(request([save('core', BLOCK)])));
    expect(savedOf(engine)).toEqual([{ name: 'core', width: 4, height: 4, runs: [[1, 1, 2], [2, 1, 2]] }]);
    expectOneUndo(engine, original);
    okOf(engine.execute(next(engine, save('core', BLOCK))));
    okOf(engine.execute(next(engine, save('core', maskFromRows(['####', '....', '....', '....'])))));
    expect(savedOf(engine)).toHaveLength(1);
    expect(savedOf(engine)?.[0]?.runs).toEqual([[0, 0, 3]]);
  });

  test('selection.delete removes it, and refuses an unknown name', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    okOf(engine.execute(request([save('core', BLOCK)])));
    okOf(engine.execute(next(engine, stepOf('selection.delete', scope, { name: 'core' }))));
    expect(savedOf(engine)).toBeUndefined();
    expect(errorOf(engine.execute(next(engine, stepOf('selection.delete', scope, { name: 'core' })))).code).toBe('TARGET_NOT_FOUND');
  });

  test('an empty mask or a mask of the wrong size is refused', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    expect(errorOf(engine.execute(request([save('none', maskFromRows(['....', '....', '....', '....']))]))).code).toBe('TARGET_EMPTY');
    expect(errorOf(engine.execute(request([save('odd', maskFromRows(['##', '##']))]))).code).toBe('INVALID_OPTION');
  });

  test('a saved selection survives saving the sprite to a file and opening it again', () => {
    const engine = pixelEngine(rowsArtwork(ROWS));
    okOf(engine.execute(request([save('core', BLOCK)])));
    const slice = sliceAsset(engine.state().artwork, { kind: 'sprite', id: rowsIds.sprite }, new Map());
    const loaded = decodeSprite(encodeSprite(slice, null, () => 1)).slice?.artwork.sprites?.find((each) => each.id === rowsIds.sprite);
    expect(loaded?.selections).toEqual([{ name: 'core', width: 4, height: 4, runs: [[1, 1, 2], [2, 1, 2]] }]);
  });
});
