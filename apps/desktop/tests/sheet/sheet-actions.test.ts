/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { addSlice } from '../../src/sheet/add-slice';
import { arrangeKind } from '../../src/sheet/arrange-kind';
import { clampDelta } from '../../src/sheet/clamp-delta';
import { currentModel } from '../../src/sheet/current-model';
import { layoutConflicts } from '../../src/sheet/layout-conflicts';
import { deleteSprites } from '../../src/sheet/delete-sprites';
import { duplicateSprites } from '../../src/sheet/duplicate-sprites';
import { pickSpriteById } from '../../src/sheet/pick-sprite-by-id';
import { placeSprites } from '../../src/sheet/place-sprites';
import { removeSlices } from '../../src/sheet/remove-slices';
import { renameSprite } from '../../src/sheet/rename-sprite';
import { reorderSprites } from '../../src/sheet/reorder-sprites';
import { scopeChipModel } from '../../src/sheet/scope-chip-model';
import { sheetModel } from '../../src/sheet/sheet-model';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { currentTarget } from '../../src/editor/current-target';
import { currentScene } from '../../src/sheet/current-scene';
import { artwork, idOf, lastNotice, namesOf, openFile, revision, spriteOf } from './sheet-harness';

const spots = (): Record<string, string> => {
  const art = artwork();
  const names = new Map(art.sprites.map((sprite) => [sprite.id, sprite.name] as const));
  return Object.fromEntries((art.sheets[0]?.entries ?? []).map((entry) => [names.get(entry.spriteId) ?? '', `${entry.at.x},${entry.at.y}`]));
};

beforeEach(() => openFile(['b', 'c'], 8));

describe('the sheet model', () => {
  it('lays loose sprites below an empty sheet without writing anything', () => {
    const before = revision();
    const model = currentModel()?.model;
    expect(model?.sheet).toBeNull();
    expect(model?.items.map((item) => item.sprite.name)).toEqual(['sprite', 'b', 'c']);
    expect(model?.items.every((item) => !item.onSheet)).toBe(true);
    expect(revision()).toBe(before);
  });

  it('keeps clicked sprites off the negative side while dragging', () => {
    const model = currentModel()?.model;
    if (!model) throw new Error('no model');
    expect(clampDelta(model.items, [model.items[0]?.sprite.id ?? ('' as never)], { x: -9, y: -9 })).toEqual({ x: 0, y: 0 });
  });
});

describe('moving sprites on the sheet', () => {
  it('creates the sheet for loose sprites and moves the picked ones in one undo step', () => {
    pickSpriteById(idOf('b'), 'replace');
    const start = currentModel()?.model.items.find((item) => item.sprite.name === 'b')?.at ?? { x: -1, y: -1 };
    const before = revision();
    expect(placeSprites([idOf('b')], { x: 40, y: 3 })).toBe(true);
    expect(revision()).toBe(before + 1);
    const art = artwork();
    expect(art.sheets).toHaveLength(1);
    expect(art.sheets[0]?.name).toBe('Sheet');
    expect(art.sheets[0]?.layout).toEqual({ kind: 'manual' });
    expect(art.sheets[0]?.entries).toHaveLength(3);
    expect(spots().b).toBe(`${start.x + 40},${start.y + 3}`);
    stepHistory('undo');
    expect(artwork().sheets).toEqual([]);
  });

  it('never changes a sprite when the layout changes', () => {
    placeSprites([idOf('b')], { x: 2, y: 2 });
    const sprites = artwork().sprites;
    expect(arrangeKind('grid')).toBe(true);
    expect(artwork().sprites).toBe(sprites);
    expect(artwork().sheets[0]?.layout).toMatchObject({ kind: 'grid', columns: 2 });
    expect(spots()).toEqual({ sprite: '0,0', b: '32,0', c: '0,32' });
    expect(arrangeKind('packed')).toBe(true);
    expect(artwork().sheets[0]?.layout.kind).toBe('packed');
    expect(arrangeKind('manual')).toBe(true);
    expect(artwork().sprites).toBe(sprites);
  });

  it('moves a group by the same distance', () => {
    arrangeKind('grid');
    placeSprites([idOf('sprite'), idOf('b')], { x: 6, y: 1 });
    expect(spots()).toMatchObject({ sprite: '6,1', b: '38,1' });
  });

  it('counts the sprite pairs a resize would push into each other', () => {
    arrangeKind('grid');
    const wider = new Map([[idOf('sprite'), { width: 40, height: 8 }]]);
    expect(layoutConflicts(artwork(), idOf('sprite'), wider)).toBe(1);
    expect(layoutConflicts(artwork(), idOf('sprite'), new Map([[idOf('sprite'), { width: 8, height: 8 }]]))).toBe(0);
    expect(layoutConflicts(artwork(), idOf('sprite'), new Map())).toBe(0);
  });

  it('shows the sheet of the active sprite with the others as loose sprites', () => {
    arrangeKind('grid');
    const model = sheetModel({ artwork: artwork(), activeId: idOf('b') });
    expect(model.items.every((item) => item.onSheet)).toBe(true);
    expect(model.overlaps).toEqual([]);
  });
});

describe('the sprite list', () => {
  it('renames a sprite and refuses a name that is taken', () => {
    expect(renameSprite(idOf('b'), 'bee')).toBe(true);
    expect(namesOf()).toEqual(['sprite', 'bee', 'c']);
    expect(renameSprite(idOf('c'), 'BEE')).toBe(false);
    expect(lastNotice()).toBe('Name BEE is already used. Choose another name.');
  });

  it('duplicates the picked sprites, picks the copies and undoes in one step', () => {
    pickSpriteById(idOf('b'), 'replace');
    pickSpriteById(idOf('c'), 'toggle');
    const before = revision();
    duplicateSprites([idOf('b'), idOf('c')]);
    expect(revision()).toBe(before + 1);
    expect(namesOf()).toEqual(['sprite', 'b', 'b copy', 'c', 'c copy']);
    expect(useSpriteStore.getState().selected).toHaveLength(2);
    stepHistory('undo');
    expect(namesOf()).toEqual(['sprite', 'b', 'c']);
  });

  it('deletes the picked sprites and picks a neighbour', () => {
    pickSpriteById(idOf('b'), 'replace');
    deleteSprites([idOf('b')]);
    expect(namesOf()).toEqual(['sprite', 'c']);
    expect(currentTarget()?.sprite.name).toBe('c');
    stepHistory('undo');
    expect(namesOf()).toEqual(['sprite', 'b', 'c']);
  });

  it('keeps the last sprite and says so', () => {
    deleteSprites([idOf('sprite'), idOf('b'), idOf('c')]);
    expect(namesOf()).toHaveLength(3);
    expect(lastNotice()).toBe('A file keeps at least one sprite.');
  });

  it('moves a sprite earlier and later', () => {
    reorderSprites([idOf('c')], { by: -1 });
    expect(namesOf()).toEqual(['sprite', 'c', 'b']);
    reorderSprites([idOf('sprite')], { to: 2 });
    expect(namesOf()).toEqual(['c', 'b', 'sprite']);
  });

  it('adds and removes slices', () => {
    expect(addSlice(idOf('b'), { x: 1, y: 1, width: 3, height: 3 })).toBe(true);
    expect(addSlice(idOf('b'), { x: 0, y: 0, width: 2, height: 2 })).toBe(true);
    expect(spriteOf('b').slices.map((slice) => slice.name)).toEqual(['Slice', 'Slice 2']);
    expect(addSlice(idOf('b'), { x: 6, y: 6, width: 9, height: 9 })).toBe(false);
    expect(removeSlices([idOf('b')])).toBe(true);
    expect(spriteOf('b').slices).toEqual([]);
  });
});

describe('the scope chips', () => {
  it('say how many sprites are picked and what the layer and frame scopes are', () => {
    pickSpriteById(idOf('sprite'), 'replace');
    pickSpriteById(idOf('b'), 'toggle');
    pickSpriteById(idOf('c'), 'toggle');
    const scene = currentScene();
    const target = currentTarget();
    if (!scene || !target) throw new Error('no scene');
    const all = { sprites: 'selected', layers: 'all', frames: 'all' } as const;
    expect(scopeChipModel(scene, target, all)).toEqual({
      multi: true,
      sprites: 'Sprites: 3 selected',
      layers: 'Layers: All (1)',
      frames: 'Frames: Current (1 of 1)',
    });
    expect(scopeChipModel(scene, target, { sprites: 'current', layers: 'active', frames: 'current' })).toMatchObject({
      sprites: 'Sprite: c',
      layers: 'Layers: Layer 1',
    });
  });

  it('are not menus for one sprite', () => {
    pickSpriteById(idOf('b'), 'replace');
    const scene = currentScene();
    const target = currentTarget();
    if (!scene || !target) throw new Error('no scene');
    expect(scopeChipModel(scene, target, { sprites: 'selected', layers: 'all', frames: 'all' }).multi).toBe(false);
  });
});
