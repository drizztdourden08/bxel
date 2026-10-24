/* @layer renderer-app @kind test */
import type { SpriteId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { applyOrder } from '../../src/sheet-manager/apply-order';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { bandIds } from '../../src/sheet-manager/band-ids';
import { bandRect } from '../../src/sheet-manager/band-rect';
import { invertIds } from '../../src/sheet-manager/invert-ids';
import { orderMoves } from '../../src/sheet-manager/order-moves';
import { selectIds } from '../../src/sheet-manager/select-ids';
import { sortFacts } from '../../src/sheet-manager/sort-facts';
import { pickVisible } from '../../src/sheet-manager/pick-visible';
import { currentScene } from '../../src/sheet/current-scene';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { artwork, idOf, namesOf, openFile, revision } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

beforeEach(() => openFile(['walk_10', 'walk_2', 'idle'], 8));

describe('moves that make an order', () => {
  it('needs no move for an order that is already right', () => {
    expect(orderMoves(idsOf('idle'), idsOf('idle'))).toEqual([]);
  });

  it('moves each sprite that is out of place to its slot', () => {
    const ids = (...names: string[]): SpriteId[] => names.map((name) => name as SpriteId);
    const moves = orderMoves(ids('c', 'a', 'b'), ids('a', 'b', 'c'));
    expect(moves.map((move) => move.to)).toEqual([0, 1]);
  });
});

describe('sorting the sheet order', () => {
  it('puts the sprites in natural name order as one undo step', () => {
    const sorted = sortFacts(allFacts(artwork(), null), 'name', false).map((fact) => fact.sprite.id);
    const before = revision();
    expect(applyOrder(sorted)).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(namesOf()).toEqual(['idle', 'sprite', 'walk_2', 'walk_10']);
    expect(applyOrder(sorted)).toBe(false);
    stepHistory('undo');
    expect(namesOf()).toEqual(['sprite', 'walk_10', 'walk_2', 'idle']);
  });
});

describe('picking in the order shown', () => {
  it('picks a range along the order given, not the sheet order', () => {
    const shown = idsOf('idle', 'walk_2', 'walk_10');
    pickVisible(shown, idOf('idle'), 'replace');
    pickVisible(shown, idOf('walk_10'), 'range');
    expect(currentScene()?.selected.map((sprite) => sprite.name)).toEqual(['walk_10', 'walk_2', 'idle']);
    expect(useSpriteStore.getState().anchor).toBe(idOf('idle'));
  });

  it('picks a list of sprites and keeps the active one when it stays in the list', () => {
    pickVisible(idsOf('walk_2'), idOf('walk_2'), 'replace');
    selectIds(idsOf('idle', 'walk_2'));
    expect(currentScene()?.selected.map((sprite) => sprite.name)).toEqual(['walk_2', 'idle']);
    expect(currentScene()?.active?.name).toBe('walk_2');
    selectIds(idsOf('idle'));
    expect(currentScene()?.active?.name).toBe('idle');
  });

  it('inverts a pick along the order given', () => {
    expect(invertIds(idsOf('idle', 'walk_2', 'walk_10'), idsOf('walk_2'))).toEqual(idsOf('idle', 'walk_10'));
  });
});

describe('the drag rectangle', () => {
  it('works from any corner and picks the boxes it touches', () => {
    const band = bandRect({ x: 30, y: 30 }, { x: 5, y: 10 });
    expect(band).toEqual({ x: 5, y: 10, width: 25, height: 20 });
    const boxes = [
      { id: idOf('idle'), x: 0, y: 0, width: 10, height: 10 },
      { id: idOf('walk_2'), x: 40, y: 40, width: 10, height: 10 },
      { id: idOf('walk_10'), x: 20, y: 20, width: 10, height: 10 },
    ];
    expect(bandIds(boxes, { x: 5, y: 5, width: 20, height: 20 })).toEqual(idsOf('idle', 'walk_10'));
    expect(bandIds(boxes, { x: 60, y: 60, width: 5, height: 5 })).toEqual([]);
  });
});
