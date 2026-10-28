/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilemapStore } from '../stores/useTilemapStore';
import { COLLISION_COMMAND as ID } from './collision-command-id.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const COLLISION_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.toggleOverlay,
    label: 'Show or hide tile collision on the map',
    group: COMMAND_GROUP.tilemap,
    checked: () => useTilemapStore.getState().showCollision,
    run: () => useTilemapStore.getState().setShowCollision(!useTilemapStore.getState().showCollision),
  },
].map(ruled);

export { COLLISION_COMMANDS };
