/* @layer renderer-app @kind test */
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { folderGroups } from '../../src/sheet-manager/folder-groups';
import { gridColumns } from '../../src/sheet-manager/grid-columns';
import { gridRows } from '../../src/sheet-manager/grid-rows';
import { gridTileRects } from '../../src/sheet-manager/grid-tile-rects';
import { rowToken } from '../../src/sheet-manager/row-token';
import { spacerBlocks } from '../../src/sheet-manager/spacer-blocks';
import { visibleOrder } from '../../src/sheet-manager/visible-order';
import { windowParts } from '../../src/sheet-manager/window-parts';
import { selectionIds } from '../../src/sheet/selection-ids';
import { spriteScene } from '../../src/sheet/sprite-scene';
import { VirtualGrid } from '../../src/views/SpritesPanel/sub-components/VirtualGrid';
import type { ManagerModel, SpriteGridProps } from '../../src/views/SpritesPanel/SpritesPanel.type';
import { artwork, openFile } from '../sheet/sheet-harness';

Object.assign(globalThis, { React });

const none = (): void => undefined;

const modelOf = (): ManagerModel => {
  const art = artwork();
  const scene = spriteScene(art, { activeId: null, selected: [] });
  const facts = allFacts(art, null);
  const groups = folderGroups(facts, new Set());
  return { artwork: art, scene, sheet: null, facts, shown: facts, groups, order: visibleOrder(groups), sizes: [], tags: [], twins: new Set(), ids: selectionIds(scene) };
};

describe('rows of the grid', () => {
  it('cuts the sprites of a folder into rows of the width of the panel', () => {
    const names = ['solo', 'hero/a', 'hero/b', 'hero/c'];
    openFile(names, 8);
    const art = artwork();
    const facts = allFacts(art, null).filter((fact) => names.includes(fact.sprite.name));
    const rows = gridRows(folderGroups(facts, new Set()), 2);
    expect(rows.map((row) => [row.group?.path ?? '', row.facts.length])).toEqual([['', 1], ['hero', 0], ['', 2], ['', 1]]);
  });

  it('counts the columns that fit and keeps one at least', () => {
    expect(gridColumns(400, 48)).toBe(5);
    expect(gridColumns(10, 128)).toBe(1);
  });

  it('picks a row token that holds the tile for every zoom', () => {
    expect([24, 32, 48, 56, 64, 72, 96, 104, 112, 128].map(rowToken)).toEqual([80, 80, 96, 96, 128, 128, 160, 160, 192, 192]);
  });
});

describe('the window over the rows', () => {
  it('fills the gaps before, between and after the drawn rows with spacers', () => {
    expect(windowParts([3, 4, 5], 10)).toEqual([
      { kind: 'space', at: 0, rows: 3 },
      { kind: 'row', at: 3, rows: 1 },
      { kind: 'row', at: 4, rows: 1 },
      { kind: 'row', at: 5, rows: 1 },
      { kind: 'space', at: 6, rows: 4 },
    ]);
    expect(windowParts([0, 1, 9], 10).map((part) => part.kind)).toEqual(['row', 'row', 'space', 'row']);
    expect(windowParts([0, 1], 2).every((part) => part.kind === 'row')).toBe(true);
  });

  it('builds a gap from few blocks, starting with one row so that the first child is a row high', () => {
    expect(spacerBlocks(0, 0)).toEqual([]);
    expect(spacerBlocks(10, 1)).toEqual([{ at: 10, size: 1 }]);
    const blocks = spacerBlocks(0, 1000);
    expect(blocks[0]).toEqual({ at: 0, size: 1 });
    expect(blocks.reduce((sum, block) => sum + block.size, 0)).toBe(1000);
    expect(blocks.length).toBeLessThan(20);
  });
});

describe('the rectangles for the marquee', () => {
  it('places every tile of every row, also the ones that are not drawn', () => {
    openFile(['a', 'b', 'c', 'd', 'e'], 8);
    const facts = allFacts(artwork(), null).filter((fact) => fact.sprite.name !== 'sprite');
    const rows = gridRows(folderGroups(facts, new Set()), 2);
    const rects = gridTileRects(rows, { rowHeight: 100, left: 8, inset: 2, tileWidth: 50, tileHeight: 60, gap: 4 });
    expect(rects).toHaveLength(5);
    expect(rects.map((item) => [item.rect.x, item.rect.y])).toEqual([[8, 2], [62, 2], [8, 102], [62, 102], [8, 202]]);
    expect(rects[0]?.rect).toMatchObject({ width: 50, height: 60 });
  });
});

describe('the drawn grid of a large sheet', () => {
  beforeEach(() => openFile(Array.from({ length: 250 }, (_unused, at) => `s${at}`), 8));

  it('draws a part of the tiles and keeps room for the rest', () => {
    const props: SpriteGridProps = {
      model: modelOf(),
      affected: [],
      box: 48,
      dragFor: () => ({ onDragStart: none, onDragOver: none, onDrop: none }),
      handlersFor: () => ({ onPick: none, onRename: none, onMenu: none }),
    };
    const page = renderToString(createElement(VirtualGrid, props));
    const tiles = page.match(/data-sprite-id=/g)?.length ?? 0;
    expect(tiles).toBeGreaterThan(0);
    expect(tiles).toBeLessThan(251);
    expect(page).toContain('data-row="96"');
    expect(page).toContain('sprites-panel__vspace');
  });
});
