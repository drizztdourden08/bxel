/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilemapStore } from '../stores/useTilemapStore';
import { ANIMATION_COMMAND as ID } from './animation-command-id.constants';
import { onSurface } from './on-surface';
import { COMMAND_GROUP } from './keymap.constants';

const ANIMATION_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.toggleTiles,
    label: 'Play or pause the animated tiles on the map',
    group: COMMAND_GROUP.tilemap,
    checked: () => useTilemapStore.getState().animateTiles,
    run: () => useTilemapStore.getState().setAnimateTiles(!useTilemapStore.getState().animateTiles),
  },
].map(onSurface('map', 'tile'));

export { ANIMATION_COMMANDS };
