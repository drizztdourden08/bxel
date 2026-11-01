/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { COMMAND_ID, TILED_COMMAND } from '../keymap/keymap.constants';
import { TILE_LABELS, TILE_MODES } from '../stores/view-store.constants';
import type { ViewParts } from './view-entries.type';

const viewEntries = (parts: ViewParts): ContextMenuEntry => ({
  label: 'View',
  items: [
    COMMAND_ID.zoomIn,
    COMMAND_ID.zoomOut,
    COMMAND_ID.zoomFit,
    COMMAND_ID.zoomActual,
    'separator',
    COMMAND_ID.pixelGrid,
    { command: COMMAND_ID.majorGrid, hidden: !parts.major },
    { command: COMMAND_ID.tileGrid, hidden: !parts.tile },
    { command: COMMAND_ID.isoGrid, hidden: !parts.tile },
    { command: COMMAND_ID.guides, hidden: !parts.guides },
    COMMAND_ID.rulers,
    COMMAND_ID.snap,
    { command: COMMAND_ID.lockGuides, hidden: !parts.guides },
    COMMAND_ID.hideOverlays,
    { command: COMMAND_ID.mirrorView, hidden: !parts.tiled },
    { command: COMMAND_ID.splitView, hidden: !parts.tiled },
    { command: COMMAND_ID.splitLink, hidden: !parts.tiled },
    { command: COMMAND_ID.splitActual, hidden: !parts.tiled },
    { command: COMMAND_ID.loupe, hidden: !parts.tiled },
    { command: COMMAND_ID.fullscreenPreview, hidden: !parts.tiled },
    {
      label: 'Tiled preview',
      hidden: !parts.tiled,
      items: TILE_MODES.map((mode) => ({ command: TILED_COMMAND[mode], label: TILE_LABELS[mode], kind: 'radio' as const })),
    },
  ],
});

export { viewEntries };
