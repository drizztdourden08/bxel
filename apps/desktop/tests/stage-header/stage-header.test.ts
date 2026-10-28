/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { buildHeader } from '../../src/stage-header/build-header';
import type { HeaderActions, HeaderInput, HeaderModel, LayerRow, SpriteHeader } from '../../src/stage-header/stage-header.type';

const actions = (): HeaderActions => ({
  back: vi.fn(),
  toggleBroadcast: vi.fn(),
  openSprite: vi.fn(),
  copyFrame: vi.fn(),
  placeTiles: vi.fn(),
  pickLayer: vi.fn(),
  toggleLayerFlag: vi.fn(),
  flagMapLayer: vi.fn(),
  setSpritesScope: vi.fn(),
  setLayerScope: vi.fn(),
});

const layer = (state: LayerRow['state'] = ''): LayerRow => ({ id: 'layer-1' as LayerRow['id'], name: 'Body', state, active: true });

const sprite = (patch: Partial<SpriteHeader> = {}): SpriteHeader => ({
  name: 'Hero',
  layers: [layer()],
  multi: false,
  count: 1,
  broadcast: false,
  canBroadcast: false,
  isolated: false,
  spritesScope: 'current',
  layerScope: 'active',
  ...patch,
});

const input = (patch: Partial<HeaderInput> = {}): HeaderInput => ({
  surface: 'sprite',
  assetName: 'Hero',
  readOnly: false,
  hiddenGrids: false,
  sprite: sprite(),
  animation: null,
  sheetSelected: 0,
  tile: null,
  map: null,
  ...patch,
});

const built = (patch: Partial<HeaderInput>, given = actions()): HeaderModel => {
  const model = buildHeader(input(patch), given);
  if (!model) throw new Error('no header');
  return model;
};

const labels = (model: HeaderModel): string[] => model.crumbs.map((crumb) => crumb.label);

describe('the stage header of a sprite', () => {
  it('shows nothing without an open asset', () => {
    expect(buildHeader(input({ surface: 'none' }), actions())).toBeNull();
  });

  it('names the sprite and the layer of a sprite', () => {
    const model = built({});
    expect(labels(model)).toEqual(['Hero', 'Body']);
    expect(model.chips).toEqual([]);
    expect(model.actions).toEqual([]);
  });

  it('starts with a Back crumb when the sprite was isolated from the sheet, and Back returns to the sheet', () => {
    const given = actions();
    const model = built({ sprite: sprite({ isolated: true }) }, given);
    expect(labels(model)).toEqual(['Sheet', 'Hero', 'Body']);
    model.crumbs[0]?.run?.();
    expect(given.back).toHaveBeenCalledTimes(1);
  });

  it('offers Paint all for two or more selected sprites and a chip with Stop while painting them', () => {
    const given = actions();
    const ready = built({ sprite: sprite({ multi: true, count: 3, canBroadcast: true }) }, given);
    expect(ready.actions.map((action) => action.label)).toEqual(['Paint all']);
    ready.actions[0]?.run();
    expect(given.toggleBroadcast).toHaveBeenCalledTimes(1);
    const painting = built({ sprite: sprite({ multi: true, count: 3, canBroadcast: true, broadcast: true }) }, given);
    expect(painting.chips.map((chip) => chip.text)).toEqual(['Painting 3 sprites']);
    expect(painting.actions).toEqual([]);
    painting.chips[0]?.action?.run();
    expect(given.toggleBroadcast).toHaveBeenCalledTimes(2);
  });

  it('puts the edit scope menus on the sprite and layer crumbs only for a multiple selection', () => {
    expect(built({}).crumbs.find((crumb) => crumb.id === 'sprite')?.menu).toBeUndefined();
    const multi = built({ sprite: sprite({ multi: true, count: 2 }) });
    expect(multi.crumbs.find((crumb) => crumb.id === 'sprite')?.menu?.length).toBe(1);
    expect(multi.crumbs.find((crumb) => crumb.id === 'layer')?.menu?.length).toBe(2);
  });

  it('shows a locked layer as a danger chip whose action unlocks it', () => {
    const given = actions();
    const model = built({ sprite: sprite({ layers: [layer('locked')] }) }, given);
    expect(model.chips[0]).toMatchObject({ id: 'layer-state', text: 'Layer locked', tone: 'danger' });
    expect(model.crumbs.at(-1)?.note).toBe('locked');
    model.chips[0]?.action?.run();
    expect(given.toggleLayerFlag).toHaveBeenCalledWith('locked', 'layer-1');
  });

  it('shows a hidden layer as a warning chip whose action shows it', () => {
    const given = actions();
    const model = built({ sprite: sprite({ layers: [layer('hidden')] }) }, given);
    expect(model.chips[0]).toMatchObject({ text: 'Layer hidden', tone: 'warning' });
    model.chips[0]?.action?.run();
    expect(given.toggleLayerFlag).toHaveBeenCalledWith('visible', 'layer-1');
  });

  it('turns the layer actions off and adds a Read only chip with its reason when the document is read only', () => {
    const model = built({ readOnly: true, sprite: sprite({ layers: [layer('locked')] }) });
    expect(model.chips.map((chip) => chip.text)).toEqual(['Layer locked', 'Read only']);
    expect(model.chips[0]?.action?.disabled).toBe(true);
    expect(model.chips[1]?.title).toMatch(/viewing/);
  });

  it('says when the grid is hidden at this zoom', () => {
    expect(built({ hiddenGrids: true }).chips.map((chip) => chip.text)).toEqual(['Grid hidden at this zoom']);
  });

});

describe('the stage header of an animation frame and a sheet', () => {
  it('shows the path of an animation frame with the shared sprite notes and actions', () => {
    const given = actions();
    const model = built({
      animation: { name: 'Run', frameAt: 3, frameCount: 8, spriteName: 'Hero', shared: true, notes: ['Also used by Idle.'], clip: true },
    }, given);
    expect(labels(model)).toEqual(['Run', 'Frame 3 of 8', 'Hero (a sprite file)', 'Body']);
    expect(model.chips.map((chip) => chip.text)).toEqual([
      'Drawing here changes the sprite file.',
      'Also used by Idle.',
      'This frame shows a cell of its sprite. Pixels outside the cell are locked.',
    ]);
    expect(model.actions.map((action) => action.label)).toEqual(['Open sprite', 'Make a copy for this animation']);
    model.actions[0]?.run();
    model.actions[1]?.run();
    expect(given.openSprite).toHaveBeenCalledTimes(1);
    expect(given.copyFrame).toHaveBeenCalledTimes(1);
  });

  it('shows an empty frame and an owned sprite without the shared notes', () => {
    const empty = built({ sprite: null, animation: { name: 'Run', frameAt: 1, frameCount: 2, spriteName: null, shared: false, notes: [], clip: false } });
    expect(labels(empty)).toEqual(['Run', 'Frame 1 of 2', 'No sprite yet']);
    expect(empty.actions).toEqual([]);
  });

  it('names the sheet and counts the selected sprites', () => {
    const model = built({ surface: 'sheet', assetName: 'World', sheetSelected: 2 });
    expect(labels(model)).toEqual(['World']);
    expect(model.chips.map((chip) => chip.text)).toEqual(['2 sprites selected']);
  });

});

describe('the stage header of a tile and a map', () => {
  it('shows the edit scope menus after the sheet when several sprites are selected', () => {
    const model = built({ surface: 'sheet', assetName: 'World', sheetSelected: 3, sprite: sprite({ multi: true, count: 3, spritesScope: 'selected' }) });
    expect(labels(model)).toEqual(['World', 'Sprites: 3 selected', 'Layers: Body']);
    expect(model.chips).toEqual([]);
    expect(model.crumbs[1]?.menu?.length).toBe(1);
  });

  it('shows Edit Tile with its way back and how many placements change', () => {
    const given = actions();
    const model = built({ surface: 'tile', tile: { key: 12, uses: 3 } }, given);
    expect(labels(model)).toEqual(['Place Tile', 'Edit Tile 12', 'Body']);
    expect(model.chips[0]?.text).toBe('Editing tile 12: 3 placements change with it');
    model.crumbs[0]?.run?.();
    expect(given.placeTiles).toHaveBeenCalledTimes(1);
    expect(built({ surface: 'tile', tile: { key: null, uses: 0 } }).chips[0]?.text).toBe('Pick a tile to edit');
  });

  it('shows the map, its layer, the turn and the selection, with an unlock action on a locked layer', () => {
    const given = actions();
    const model = built({
      surface: 'map',
      sprite: null,
      map: { mapName: 'Overworld', layerId: 'map-layer-1' as never, layerName: 'Ground', layerState: 'locked', turn: 'X Y', selection: '3 x 2 cells selected' },
    }, given);
    expect(labels(model)).toEqual(['Overworld', 'Ground']);
    expect(model.chips.map((chip) => chip.text)).toEqual(['Placing tiles', 'Turn: X Y', '3 x 2 cells selected', 'Layer locked']);
    model.chips[3]?.action?.run();
    expect(given.flagMapLayer).toHaveBeenCalledWith('locked', 'map-layer-1');
  });
});
