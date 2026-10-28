/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilemapStore } from '../stores/useTilemapStore';
import { ANIMATION_COMMAND as ID } from './animation-command-id.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const ANIMATION_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.toggleTiles,
    label: 'Play or pause the animated tiles on the map',
    group: COMMAND_GROUP.tilemap,
    checked: () => useTilemapStore.getState().animateTiles,
    run: () => useTilemapStore.getState().setAnimateTiles(!useTilemapStore.getState().animateTiles),
  },
].map(ruled);

export { ANIMATION_COMMANDS };
