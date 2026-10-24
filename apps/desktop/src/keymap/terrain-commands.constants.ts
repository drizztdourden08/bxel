/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilemapStore } from '../stores/useTilemapStore';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';
import { TERRAIN_COMMAND as ID } from './terrain-command-id.constants';

const TERRAIN_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.toggleBrush,
    label: 'Turn the terrain brush on or off',
    group: COMMAND_GROUP.tilemap,
    run: () => useTilemapStore.getState().setTerrainBrush(!useTilemapStore.getState().terrainBrush),
  },
].map(editorCommand);

export { TERRAIN_COMMANDS };
