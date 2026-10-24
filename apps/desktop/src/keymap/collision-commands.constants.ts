/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilemapStore } from '../stores/useTilemapStore';
import { COLLISION_COMMAND as ID } from './collision-command-id.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';

const COLLISION_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.toggleOverlay,
    label: 'Show or hide tile collision on the map',
    group: COMMAND_GROUP.tilemap,
    run: () => useTilemapStore.getState().setShowCollision(!useTilemapStore.getState().showCollision),
  },
].map(editorCommand);

export { COLLISION_COMMANDS };
