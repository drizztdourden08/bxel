/* @layer renderer-app @kind test */
import { NO_FLAGS, readCellFlags } from '@bxel/document';
import type { CellFlags } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { ALL_FLAGS } from '../../src/tilemap/flag-sets.constants';
import { composeFlags } from '../../src/tilemap/compose-flags';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { turnCells } from '../../src/tilemap/turn-cells';
import { createTilemap } from '../../src/tilemap/create-tilemap';
import { createTileset } from '../../src/tilemap/create-tileset';
import { lastNotice, revision } from '../sheet/sheet-harness';
import { artworkNow, cellsNow, openMapFile, picture } from './map-harness';

const KEYS = (flags: CellFlags): string => `${Number(flags.flipX)}${Number(flags.flipY)}${Number(flags.diagonal)}`;

describe('composing turns', () => {
  it('returns to the start after two flips or four quarter turns', () => {
    for (const start of ALL_FLAGS) {
      expect(composeFlags(composeFlags(start, 'flipX'), 'flipX')).toEqual(start);
      expect(composeFlags(composeFlags(start, 'flipY'), 'flipY')).toEqual(start);
      let turned = start;
      for (let count = 0; count < 4; count += 1) turned = composeFlags(turned, 'turn');
      expect(turned).toEqual(start);
    }
  });

  it('reaches eight different turns and never leaves them', () => {
    const seen = new Set<string>();
    let flags: CellFlags = NO_FLAGS;
    for (const op of ['turn', 'flipX', 'turn', 'flipY', 'turn', 'flipX', 'turn'] as const) {
      flags = composeFlags(flags, op);
      seen.add(KEYS(flags));
    }
    expect(seen.size).toBeGreaterThan(3);
    expect(ALL_FLAGS.map(KEYS)).toContain(KEYS(flags));
  });

  it('turns a plain tile a quarter clockwise', () => {
    expect(composeFlags(NO_FLAGS, 'turn')).toEqual({ flipX: true, flipY: false, diagonal: true });
  });
});

describe('turning placed cells', () => {
  beforeEach(openMapFile);

  const place = (): void => {
    placeStampAt([{ x: 0, y: 0 }]);
    useTilemapStore.getState().setSelection({ rect: { x: 0, y: 0, width: 1, height: 1 }, from: 2 });
  };

  it('turns the picture of a selected cell a quarter clockwise in one undo step', () => {
    place();
    const before = revision();
    expect(turnCells('turn')).toBe(true);
    expect(revision() - before).toBe(1);
    expect(picture()[0]?.slice(0, 2)).toEqual([4, 2]);
    expect(picture()[1]?.slice(0, 2)).toEqual([5, 3]);
    expect(readCellFlags(cellsNow()[0] ?? 0)).toEqual({ flipX: true, flipY: false, diagonal: true });
  });

  it('flips the picture of a selected cell on each axis', () => {
    place();
    turnCells('flipX');
    expect(picture()[0]?.slice(0, 2)).toEqual([3, 2]);
    turnCells('flipX');
    turnCells('flipY');
    expect(picture()[0]?.slice(0, 2)).toEqual([4, 5]);
  });

  it('changes the turn of the tile to place when nothing is selected', () => {
    const before = revision();
    expect(turnCells('flipX')).toBe(true);
    expect(useTilemapStore.getState().flags.flipX).toBe(true);
    expect(revision()).toBe(before);
  });

  it('refuses a quarter turn for tiles that are not square', () => {
    createTileset({ name: 'wide', width: 4, height: 2 });
    const wide = artworkNow().tilesets.at(-1);
    expect(createTilemap({ name: 'wide map', tilesetId: wide?.id ?? null, columns: 2, rows: 2 })).toBeNull();
    expect(turnCells('turn')).toBe(false);
    expect(lastNotice()).toContain('square');
    expect(turnCells('flipX')).toBe(true);
  });
});
