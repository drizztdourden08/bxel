/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilesetViewStore } from '../stores/useTilesetViewStore';
import type { TilesetMode } from '../stores/tileset-view-store.type';
import { commandArgs } from '../context-menu/command-args';
import type { CollisionKindArgs, SnapArgs, TileArgs, TileIndexArgs, TileMoveArgs } from '../context-menu/menu-args.type';
import { copyCollision } from '../tilemap/copy-collision';
import { copyData } from '../tilemap/copy-data';
import { findOnMap } from '../tilemap/find-on-map';
import { pasteCollision } from '../tilemap/paste-collision';
import { pasteData } from '../tilemap/paste-data';
import { addTileAt } from '../tilemap/add-tile-at';
import { deleteSelectedTiles } from '../tilemap/delete-selected-tiles';
import { moveTile } from '../tilemap/move-tile';
import { setCollisionKind } from '../tilemap/set-collision-kind';
import { stampMode } from '../tilemap/stamp-mode';
import { addPickedBox } from '../views/TilesetPanel/behavior/add-picked-box';
import { deletePickedPoint } from '../views/TilesetPanel/behavior/delete-picked-point';
import { deletePickedShape } from '../views/TilesetPanel/behavior/delete-picked-shape';
import { tracePicked } from '../views/TilesetPanel/behavior/trace-picked';
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
  { id: ID.useAsStamp, label: 'Use the selected tiles as a stamp', group, run: () => void stampMode(false) },
  { id: ID.useAsScatter, label: 'Use the selected tiles as a scatter set', group, run: () => void stampMode(true) },
  { id: ID.setCollision, label: 'Set the collision of the selected tiles', group, run: (context?: CommandContext) => void setCollisionKind(commandArgs<CollisionKindArgs>(context).kind ?? 'full') },
  { id: ID.deleteTiles, label: 'Delete the selected tiles', group, run: () => void deleteSelectedTiles() },
  { id: ID.moveTile, label: 'Move the tile in the layout', group, run: (context?: CommandContext) => void moveTile(commandArgs<TileMoveArgs>(context).direction ?? 'right', commandArgs<TileMoveArgs>(context).key) },
  { id: ID.addTileAt, label: 'Add a tile here', group, run: (context?: CommandContext) => void addTileAt(commandArgs<TileIndexArgs>(context).index ?? 0) },
  { id: ID.shapeAddBox, label: 'Add a collision box', group, run: () => void addPickedBox() },
  { id: ID.shapeTrace, label: 'Trace the pixels as a collision shape', group, run: () => void tracePicked() },
  { id: ID.shapeDelete, label: 'Delete the collision shape', group, run: () => void deletePickedShape() },
  { id: ID.shapeDeletePoint, label: 'Delete the collision point', group, run: () => void deletePickedPoint() },
  {
    id: ID.shapeSnap,
    label: 'Snap collision points to half pixels',
    group,
    checked: () => useTilesetViewStore.getState().shapeSnap === 'half',
    run: (context?: CommandContext) => {
      const view = useTilesetViewStore.getState();
      view.setShapeSnap(commandArgs<SnapArgs>(context).snap ?? (view.shapeSnap === 'half' ? 'pixel' : 'half'));
    },
  },
].map(ruled);

export { TILESET_COMMANDS };
