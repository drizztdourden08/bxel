/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { assetLook } from '../../src/asset-view/asset-look';
import { ASSET_VIEW_DEFAULTS } from '../../src/asset-view/asset-view.constants';
import { gridDefaults } from '../../src/asset-view/grid-defaults';
import { CANVAS_DEFAULTS } from '../../src/canvas-look/canvas-look.constants';
import { lookOf } from '../../src/canvas-look/look-of';
import { useAssetViewStore } from '../../src/stores/useAssetViewStore';

const base = lookOf(CANVAS_DEFAULTS);
const tileset = { tileWidth: 12, tileHeight: 20 } as never;
const sheet = (cell: number) => ({ layout: { kind: 'grid', columns: 4, cellWidth: cell, cellHeight: cell, order: 'rows' } }) as never;

describe('the grid of each asset', () => {
  it('follows the tile size of a tileset with no setting touched', () => {
    expect(gridDefaults({ surface: 'tile', tileset, sheet: null, setting: 16 })).toEqual({ tile: { width: 12, height: 20 }, source: 'tileset' });
    expect(assetLook(base, ASSET_VIEW_DEFAULTS, { width: 12, height: 20 }).tileLine).toMatchObject({ every: 12, everyY: 20 });
  });

  it('follows the cell of a map and of a grid sheet, and falls back to the setting', () => {
    expect(gridDefaults({ surface: 'map', tileset, sheet: null, setting: 16 }).source).toBe('map');
    expect(gridDefaults({ surface: 'sheet', tileset: null, sheet: sheet(24), setting: 16 })).toEqual({ tile: { width: 24, height: 24 }, source: 'sheet' });
    expect(gridDefaults({ surface: 'sheet', tileset: null, sheet: null, setting: 16 })).toEqual({ tile: { width: 16, height: 16 }, source: 'setting' });
    expect(gridDefaults({ surface: 'sprite', tileset: null, sheet: null, setting: 8 }).source).toBe('setting');
  });

  it('lets an own tile size, major spacing and game colour win over the defaults', () => {
    const own = { ...ASSET_VIEW_DEFAULTS, tileGrid: { width: 5, height: 6 }, majorEvery: 4, background: 'solid' as const, backgroundColour: '#112233' };
    const look = assetLook(base, own, { width: 12, height: 20 });
    expect(look.tileLine).toMatchObject({ every: 5, everyY: 6 });
    expect(look.majorLine.every).toBe(4);
    expect([look.checkerA, look.checkerB]).toEqual(['#112233', '#112233']);
  });

  it('leaves the look alone when nothing is set', () => {
    expect(assetLook(base, ASSET_VIEW_DEFAULTS, null)).toEqual(base);
  });
});

describe('the view state of an asset', () => {
  beforeEach(() => useAssetViewStore.setState({ views: {} }));

  it('keeps a patch per asset and forgets it on reset', () => {
    useAssetViewStore.getState().patch('a', { majorEvery: 4 });
    useAssetViewStore.getState().patch('b', { labels: false });
    expect(useAssetViewStore.getState().views).toEqual({ a: { majorEvery: 4 }, b: { labels: false } });
    useAssetViewStore.getState().reset('a');
    expect(Object.keys(useAssetViewStore.getState().views)).toEqual(['b']);
  });
});
