/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTilemapStore } from '../stores/useTilemapStore';
import { COMMAND_GROUP } from './keymap.constants';
import { TERRAIN_COMMAND as ID } from './terrain-command-id.constants';
import { ruled } from './ruled';

const TERRAIN_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.toggleBrush,
    label: 'Turn the terrain brush on or off',
    group: COMMAND_GROUP.tilemap,
    checked: () => useTilemapStore.getState().terrainBrush,
    run: () => useTilemapStore.getState().setTerrainBrush(!useTilemapStore.getState().terrainBrush),
  },
].map(ruled);

export { TERRAIN_COMMANDS };
