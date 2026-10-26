/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { SELECTION_COMMAND_ID } from '../../src/keymap/selection-command-id.constants';
import { TILEMAP_COMMAND } from '../../src/keymap/tilemap-command-id.constants';
import { switchMode } from '../../src/sheet/switch-mode';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { inMapPlace } from '../../src/tilemap/in-map-place';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { findCommand } from '../keymap/find-command';
import { cellsNow, openMapFile } from './map-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const run = (id: string): void => findCommand(id).run();

const allowed = (id: string): boolean => {
  const when = findCommand(id).when;
  return when === undefined ? true : when();
};

beforeEach(openMapFile);

describe('Tilemap mode', () => {
  it('opens with a tilemap asset and leaves the pixel commands off while tiles are placed', () => {
    expect(APP_COMMANDS.some((command) => command.id.startsWith('mode.set_'))).toBe(false);
    expect(allowed(SELECTION_COMMAND_ID.selectAll)).toBe(true);
    switchMode('tilemap');
    expect(useSpriteStore.getState().mode).toBe('tilemap');
    expect(inMapPlace()).toBe(true);
    expect(allowed(SELECTION_COMMAND_ID.selectAll)).toBe(false);
    expect(allowed(SELECTION_COMMAND_ID.copy)).toBe(false);
    expect(allowed(SELECTION_COMMAND_ID.apply)).toBe(false);
  });

  it('keeps the tool keys and maps them to the map tools', () => {
    switchMode('tilemap');
    run('tool.select_shape');
    expect(useToolStore.getState().tool).toBe('shape');
    run('tool.select_eraser');
    expect(useToolStore.getState().tool).toBe('eraser');
  });

  it('turns the tool Move into Place when the map opens', () => {
    useToolStore.getState().selectTool('move');
    switchMode('tilemap');
    expect(useToolStore.getState().tool).toBe('pencil');
  });

  it('flips the tile to place with the flip keys instead of starting a pixel flip', () => {
    switchMode('tilemap');
    run(SELECTION_COMMAND_ID.flipHorizontal);
    run(SELECTION_COMMAND_ID.flipVertical);
    expect(useTilemapStore.getState().flags).toEqual({ flipX: true, flipY: true, diagonal: false });
    run(SELECTION_COMMAND_ID.turnClockwise);
    expect(useTilemapStore.getState().flags.diagonal).toBe(true);
  });

  it('clears the selected cells with Delete and drops the selection with Deselect', () => {
    switchMode('tilemap');
    placeStampAt([{ x: 0, y: 0 }, { x: 1, y: 0 }]);
    useTilemapStore.getState().setSelection({ rect: { x: 0, y: 0, width: 1, height: 1 }, from: 2 });
    run(SELECTION_COMMAND_ID.delete);
    expect(cellsNow().slice(0, 2)).toEqual([0, 2]);
    run(SELECTION_COMMAND_ID.clear);
    expect(useTilemapStore.getState().selection).toBeNull();
  });
});

describe('Place Tile and Edit Tile', () => {
  it('switches with Alt+T and shows which mode is on in the store', () => {
    expect(findCommand(TILEMAP_COMMAND.toggleEdit).chord).toBe('Alt+T');
    run(TILEMAP_COMMAND.toggleEdit);
    expect(useSpriteStore.getState().mode).toBe('tilemap');
    expect(useTilemapStore.getState().editMode).toBe('edit');
    expect(inMapPlace()).toBe(false);
    expect(allowed(SELECTION_COMMAND_ID.selectAll)).toBe(true);
    run(TILEMAP_COMMAND.toggleEdit);
    expect(useTilemapStore.getState().editMode).toBe('place');
  });

  it('registers every tilemap command once on a known group', () => {
    const ids = APP_COMMANDS.filter((def) => def.id.startsWith('tilemap.')).map((def) => def.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.sort()).toEqual(Object.values(TILEMAP_COMMAND).sort());
  });
});
