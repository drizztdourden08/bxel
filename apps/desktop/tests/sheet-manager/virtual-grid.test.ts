/* @layer renderer-app @kind test */
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { modelFor } from './manager-harness';
import { folderGroups } from '../../src/sheet-manager/folder-groups';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { activeIndex } from '../../src/views/SpritesPanel/behavior/active-index';
import { SpriteGrid } from '../../src/views/SpritesPanel/sub-components/SpriteGrid';
import type { ManagerModel, SpriteGridProps } from '../../src/views/SpritesPanel/SpritesPanel.type';
import { artwork, openFile } from '../sheet/sheet-harness';

Object.assign(globalThis, { React });

const none = (): void => undefined;

const modelOf = (): ManagerModel => {
  const art = artwork();
  return modelFor(art, art.sheets[0] ?? null);
};

describe('S2 the active sprite in the grid', { tags: ['standard'] }, () => {
  it('counts through all the folders in the order they are drawn', () => {
    const names = ['solo', 'hero/a', 'hero/b'];
    openFile(names, 8);
    addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
    const facts = allFacts(artwork(), artwork().sheets[0] ?? null).filter((fact) => names.includes(fact.sprite.name));
    const groups = folderGroups(facts, new Set());
    const hero = groups.flatMap((group) => group.facts).find((fact) => fact.sprite.name === 'hero/b');
    expect(activeIndex(groups, hero?.sprite.id ?? null)).toBe(2);
    expect(activeIndex(groups, null)).toBe(-1);
  });
});

describe('S2 the drawn grid of a large sheet', { tags: ['standard'] }, () => {
  beforeEach(() => {
    openFile(Array.from({ length: 250 }, (_unused, at) => `s${at}`), 8);
    addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
  });

  it('draws a grid with its name and not every tile', () => {
    const props: SpriteGridProps = {
      model: modelOf(),
      table: { current: null },
      affected: [],
      box: 48,
      marks: new Map(),
      dragFor: () => ({ entries: () => [], source: 'sheet' }),
      handlersFor: () => ({ onPick: none, onEdit: none, onRename: none, onMenu: none }),
    };
    const page = renderToString(createElement(SpriteGrid, props));
    expect(page).toContain('role="grid"');
    expect(page).toContain('aria-label="Sprites"');
    expect(page.match(/data-sprite-id=/g)?.length ?? 0).toBeLessThan(251);
  });
});
