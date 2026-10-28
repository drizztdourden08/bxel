/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilemapDialogStore } from '../stores/useTilemapDialogStore';
import { addTile } from '../tilemap/add-tile';
import { askDeleteTile } from '../tilemap/ask-delete-tile';
import { clearCells } from '../tilemap/clear-cells';
import { duplicateTile } from '../tilemap/duplicate-tile';
import { editTile } from '../tilemap/edit-tile';
import { makeUnique } from '../tilemap/make-unique';
import { moveMapLayer } from '../tilemap/move-map-layer';
import { pickedKey } from '../tilemap/picked-key';
import { placeTiles } from '../tilemap/place-tiles';
import { replaceCells } from '../tilemap/replace-cells';
import { toggleEdit } from '../tilemap/toggle-edit';
import { turnCells } from '../tilemap/turn-cells';
import { COMMAND_ZONE } from './command-zone.constants';
import { editorCommand } from './editor-command';
import { onSurface } from './on-surface';
import { COMMAND_GROUP } from './keymap.constants';
import { TILEMAP_COMMAND as ID } from './tilemap-command-id.constants';

const group = COMMAND_GROUP.tilemap;

const onPicked = (run: (key: number) => unknown) => (): void => {
  const key = pickedKey();
  if (key !== null) run(key);
};

const NEW_COMMANDS: readonly CommandDef[] = [
  { id: ID.newTileset, label: 'New tileset', group, run: () => useTilemapDialogStore.getState().show('tileset') },
  { id: ID.newTilemap, label: 'New tilemap', group, run: () => useTilemapDialogStore.getState().show('tilemap') },
];

const TILE_COMMANDS: readonly CommandDef[] = [
  { id: ID.addTile, label: 'Add tile', group, run: () => void addTile() },
  { id: ID.duplicateTile, label: 'Duplicate tile', group, run: onPicked(duplicateTile) },
  {
    id: ID.deleteTile,
    label: 'Delete tile',
    group,
    chord: 'Delete',
    zone: COMMAND_ZONE.tileset,
    whileTyping: false,
    run: onPicked(askDeleteTile),
  },
  { id: ID.makeUnique, label: 'Make selected cells unique', group, run: () => void makeUnique() },
  { id: ID.toggleEdit, label: 'Switch between Place Tile and Edit Tile', group, chord: 'Alt+T', whileTyping: false, run: () => void toggleEdit() },
  { id: ID.placeTiles, label: 'Place Tile', group, run: () => void placeTiles() },
  { id: ID.editTile, label: 'Edit Tile', group, run: () => void editTile() },
];

const CELL_COMMANDS: readonly CommandDef[] = [
  { id: ID.replaceSelection, label: 'Replace tile in selection', group, run: () => void replaceCells(false) },
  { id: ID.replaceEverywhere, label: 'Replace tile everywhere on the layer', group, run: () => void replaceCells(true) },
  { id: ID.clearCells, label: 'Clear selected cells', group, run: () => void clearCells() },
  { id: ID.flipX, label: 'Flip placed tile X', group, run: () => void turnCells('flipX') },
  { id: ID.flipY, label: 'Flip placed tile Y', group, run: () => void turnCells('flipY') },
  { id: ID.turn, label: 'Rotate placed tile 90', group, run: () => void turnCells('turn') },
  { id: ID.layerUp, label: 'Move map layer up', group, run: () => void moveMapLayer(1) },
  { id: ID.layerDown, label: 'Move map layer down', group, run: () => void moveMapLayer(-1) },
];

const TILEMAP_COMMANDS: readonly CommandDef[] = [
  ...NEW_COMMANDS.map(editorCommand),
  ...[...TILE_COMMANDS, ...CELL_COMMANDS].map(onSurface('map', 'tile')),
];

export { TILEMAP_COMMANDS };
