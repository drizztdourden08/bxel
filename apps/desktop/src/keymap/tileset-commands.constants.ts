/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilesetViewStore } from '../stores/useTilesetViewStore';
import type { TilesetMode } from '../stores/tileset-view-store.type';
import { commandArgs } from '../context-menu/command-args';
import type { TileArgs } from '../context-menu/menu-args.type';
import { copyCollision } from '../tilemap/copy-collision';
import { copyData } from '../tilemap/copy-data';
import { findOnMap } from '../tilemap/find-on-map';
import { pasteCollision } from '../tilemap/paste-collision';
import { pasteData } from '../tilemap/paste-data';
import { animateSelectedTiles } from '../tilemap/animate-selected-tiles';
import { focusTileSearch } from '../tilemap/focus-tile-search';
import type { CommandContext } from '@drizztdourden08/brock-react';
import { COMMAND_ZONE } from './command-zone.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { TILESET_COMMAND as ID } from './tileset-command-id.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.tilemap;

const mode = (id: string, label: string, value: TilesetMode): CommandDef => ({
  id,
  label: `Tileset mode: ${label}`,
  group,
  run: () => useTilesetViewStore.getState().setMode(value),
});

const TILESET_COMMANDS: readonly CommandDef[] = [
  mode(ID.modeTiles, 'Tiles', 'tiles'),
  mode(ID.modeTerrain, 'Terrain', 'terrain'),
  mode(ID.modeCollision, 'Collision', 'collision'),
  mode(ID.modeData, 'Data', 'data'),
  mode(ID.modeAnimation, 'Animation', 'animation'),
  { id: ID.focusSearch, label: 'Search tiles', group, chord: 'Ctrl+F', zone: COMMAND_ZONE.tileset, whileTyping: false, run: focusTileSearch },
  { id: ID.animationFromTiles, label: 'Make an animation from the selected tiles', group, run: () => void animateSelectedTiles() },
  { id: ID.findOnMap, label: 'Find the tile on the map', group, run: (context?: CommandContext) => void findOnMap(commandArgs<TileArgs>(context).key) },
  { id: ID.copyCollision, label: 'Copy the collision of the tile', group, run: (context?: CommandContext) => void copyCollision(commandArgs<TileArgs>(context).key) },
  { id: ID.pasteCollision, label: 'Paste the collision on the tile', group, run: (context?: CommandContext) => void pasteCollision(commandArgs<TileArgs>(context).key) },
  { id: ID.copyData, label: 'Copy the data of the tile', group, run: (context?: CommandContext) => void copyData(commandArgs<TileArgs>(context).key) },
  { id: ID.pasteData, label: 'Paste the data on the tile', group, run: (context?: CommandContext) => void pasteData(commandArgs<TileArgs>(context).key) },
].map(ruled);

export { TILESET_COMMANDS };
