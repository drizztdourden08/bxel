/* @layer renderer-app @kind test */
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { folderGroups } from '../../src/sheet-manager/folder-groups';
import { visibleOrder } from '../../src/sheet-manager/visible-order';
import { selectionIds } from '../../src/sheet/selection-ids';
import { spriteScene } from '../../src/sheet/sprite-scene';
import { activeIndex } from '../../src/views/SpritesPanel/behavior/active-index';
import { tileSize } from '../../src/views/SpritesPanel/behavior/tile-size';
import { SpriteGrid } from '../../src/views/SpritesPanel/sub-components/SpriteGrid';
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

describe('the tile of the grid', () => {
  it('picks the smallest tile that holds the thumbnail and its name for every zoom', () => {
    expect([24, 48, 64, 128].map((box) => tileSize(box))).toEqual([
      { width: 'size-48', height: 'size-80' },
      { width: 'size-80', height: 'size-96' },
      { width: 'size-96', height: 'size-128' },
      { width: 'size-160', height: 'size-192' },
    ]);
  });
});

describe('the active sprite in the grid', () => {
  it('counts through all the folders in the order they are drawn', () => {
    const names = ['solo', 'hero/a', 'hero/b'];
    openFile(names, 8);
    const facts = allFacts(artwork(), null).filter((fact) => names.includes(fact.sprite.name));
    const groups = folderGroups(facts, new Set());
    const hero = groups.flatMap((group) => group.facts).find((fact) => fact.sprite.name === 'hero/b');
    expect(activeIndex(groups, hero?.sprite.id ?? null)).toBe(2);
    expect(activeIndex(groups, null)).toBe(-1);
  });
});

describe('the drawn grid of a large sheet', () => {
  beforeEach(() => openFile(Array.from({ length: 250 }, (_unused, at) => `s${at}`), 8));

  it('draws a grid with its name and not every tile', () => {
    const props: SpriteGridProps = {
      model: modelOf(),
      affected: [],
      box: 48,
      dragFor: () => ({ onDragStart: none, onDragOver: none, onDrop: none }),
      handlersFor: () => ({ onPick: none, onRename: none, onMenu: none }),
    };
    const page = renderToString(createElement(SpriteGrid, props));
    expect(page).toContain('role="grid"');
    expect(page).toContain('aria-label="Sprites"');
    expect(page.match(/data-sprite-id=/g)?.length ?? 0).toBeLessThan(251);
  });
});
