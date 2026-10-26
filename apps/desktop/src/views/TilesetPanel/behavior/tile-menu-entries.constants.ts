/* @layer renderer-app @kind constants */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { TILEMAP_COMMAND as ID } from '../../../keymap/tilemap-command-id.constants';

const GRID_ENTRIES: readonly ContextMenuEntry[] = [ID.addTile, ID.newTileset, ID.newTilemap];

export { GRID_ENTRIES };
