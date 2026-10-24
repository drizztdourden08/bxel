/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { startTiledImport } from '../tiled-import/start-tiled-import';
import { TILED_COMMAND as ID } from './tiled-command-id.constants';

const TILED_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.importMap,
    label: 'Import Tiled map',
    icon: 'pixel-tileset',
    group: 'File',
    run: () => {
      void startTiledImport();
    },
  },
];

export { TILED_COMMANDS };
