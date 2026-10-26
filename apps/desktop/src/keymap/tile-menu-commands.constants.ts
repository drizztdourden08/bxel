/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { PixelArgs, TileArgs } from '../context-menu/menu-args.type';
import { cellKeyAt } from '../tilemap/cell-key-at';
import { editTile } from '../tilemap/edit-tile';
import { pickAt } from '../tilemap/pick-at';
import { placeWithTile } from '../tilemap/place-with-tile';
import { COMMAND_GROUP } from './keymap.constants';
import { onSurface } from './on-surface';

const group = COMMAND_GROUP.tilemap;

const TILE_MENU_COMMANDS: readonly CommandDef[] = [
  {
    id: 'tilemap.use_tile',
    label: 'Place with a tile',
    group,
    run: (context?: CommandContext) => {
      const { key } = commandArgs<TileArgs>(context);
      if (key !== undefined) placeWithTile(key);
    },
  },
  {
    id: 'tilemap.pick_tile_here',
    label: 'Pick the tile under a map cell',
    group,
    run: (context?: CommandContext) => {
      const { x, y } = commandArgs<PixelArgs>(context);
      if (x !== undefined && y !== undefined) pickAt({ x, y });
    },
  },
  {
    id: 'tilemap.edit_tile_here',
    label: 'Edit the tile under a map cell',
    group,
    run: (context?: CommandContext) => {
      const { x, y } = commandArgs<PixelArgs>(context);
      const key = x === undefined || y === undefined ? null : cellKeyAt({ x, y });
      if (key !== null) editTile(key);
    },
  },
].map(onSurface('map', 'tile'));

export { TILE_MENU_COMMANDS };
