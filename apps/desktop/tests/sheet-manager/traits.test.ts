/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { activeFilters } from '../../src/sheet-manager/active-filters';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { assignBank } from '../../src/sheet-manager/assign-bank';
import { bankPlan } from '../../src/sheet-manager/bank-plan';
import { idsByTrait } from '../../src/sheet-manager/ids-by-trait';
import { NO_FILTER } from '../../src/sheet-manager/manager.constants';
import type { ListQuery } from '../../src/sheet-manager/manager.type';
import { managerSheet } from '../../src/sheet-manager/manager-sheet';
import { tagOptions } from '../../src/sheet-manager/tag-options';
import { visibleFacts } from '../../src/sheet-manager/visible-facts';
import { artwork, idOf, lastNotice, openFile, patch, revision, spriteOf } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

const base: ListQuery = { query: '', filter: NO_FILTER, sortKey: 'manual', sortDown: false };

const factsOf = () => {
  const art = artwork();
  return allFacts(art, managerSheet(art, null, null));
};

const shown = (change: Partial<ListQuery>): string[] => visibleFacts(factsOf(), { ...base, ...change }).map((fact) => fact.sprite.name);

const addTag = (name: string, sprite: string): void => {
  runDocument('Tag', [
    { name: COMMAND_NAME.tagAdd, targets: spritesTarget([idOf(sprite)]), options: { name, from: { by: 'index', index: 0 }, to: { by: 'index', index: 0 } } },
  ]);
};

const addBank = (name: string, colors: string[]): void => {
  runDocument('Bank', [{ name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options: { name, cap: 16, transparent: true, colors } }]);
};

const bankId = (name: string) => {
  const found = artwork().banks.find((bank) => bank.name === name);
  if (!found) throw new Error(`no bank ${name}`);
  return found.id;
};

beforeEach(() => {
  openFile(['a', 'b', 'c'], 8);
  addTag('walk', 'a');
  addTag('walk', 'b');
  addTag('idle', 'c');
});

describe('filters and selecting by trait', () => {
  it('lists the tag names of the file in natural order', () => {
    expect(tagOptions(artwork().sprites)).toEqual(['idle', 'walk']);
  });

  it('shows only the sprites with a tag or with a palette', () => {
    expect(shown({ filter: { ...NO_FILTER, tag: 'walk' } })).toEqual(['a', 'b']);
    expect(shown({ filter: { ...NO_FILTER, tag: 'idle' } })).toEqual(['c']);
    expect(shown({ filter: { ...NO_FILTER, bank: spriteOf('a').bankId } })).toHaveLength(4);
    expect(shown({ filter: { ...NO_FILTER, bank: 'bnk_none' } })).toEqual([]);
    expect(activeFilters({ ...NO_FILTER, tag: 'walk', bank: 'x', size: '8x8' })).toBe(3);
  });

  it('selects by tag, by size and by palette', () => {
    expect(idsByTrait(factsOf(), { kind: 'tag', value: 'walk' })).toEqual(idsOf('a', 'b'));
    expect(idsByTrait(factsOf(), { kind: 'size', value: '8x8' })).toEqual(idsOf('a', 'b', 'c'));
    expect(idsByTrait(factsOf(), { kind: 'bank', value: spriteOf('a').bankId })).toHaveLength(4);
  });

  it('sorts by the number of tags and by the name of the palette', () => {
    addTag('run', 'c');
    expect(shown({ sortKey: 'tags', sortDown: true }).at(0)).toBe('c');
    expect(shown({ sortKey: 'bank' })).toHaveLength(4);
  });
});

describe('changing the palette of sprites', () => {
  beforeEach(() => {
    patch('a', { x: 0, y: 0, width: 1, height: 1 }, 1);
    patch('a', { x: 1, y: 0, width: 1, height: 1 }, 2);
    addBank('Single', ['#ff0000']);
  });

  it('plans how many colours are in use and how many become one', () => {
    const plan = bankPlan(artwork(), [spriteOf('a'), spriteOf('b')], bankId('Single'));
    expect(plan).toMatchObject({ colours: 2, merged: 1, skipped: 0, blocker: null });
    expect(plan.movers.map((sprite) => sprite.name)).toEqual(['a', 'b']);
  });

  it('leaves out a sprite that has the palette and stops when none is left', () => {
    assignBank(idsOf('a'), bankId('Single'));
    expect(bankPlan(artwork(), [spriteOf('a')], bankId('Single')).blocker).toContain('already');
    const plan = bankPlan(artwork(), [spriteOf('a'), spriteOf('b')], bankId('Single'));
    expect(plan.skipped).toBe(1);
    expect(plan.movers.map((sprite) => sprite.name)).toEqual(['b']);
  });

  it('moves the sprites to the palette in one undo step', () => {
    const before = revision();
    expect(assignBank(idsOf('a', 'b'), bankId('Single'))).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(spriteOf('a').bankId).toBe(bankId('Single'));
    expect(Array.from(Object.values(spriteOf('a').cels)[0]?.pixels.subarray(0, 2) ?? [])).toEqual([1, 1]);
    stepHistory('undo');
    expect(spriteOf('a').bankId).not.toBe(bankId('Single'));
    expect(lastNotice()).toBeNull();
  });
});
