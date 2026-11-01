/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { CANVAS_MENU } from '../EditorCanvas.constants';

const viewHereEntries = (here: Point | null): readonly ContextMenuEntry[] => [
  { command: COMMAND_ID.centreHere, hidden: here === null, args: { x: here?.x, y: here?.y } },
  {
    label: CANVAS_MENU.addGuide,
    hidden: here === null,
    items: [
      { command: 'guide.add_here', label: CANVAS_MENU.guideX, args: { axis: 'x', position: here?.x } },
      { command: 'guide.add_here', label: CANVAS_MENU.guideY, args: { axis: 'y', position: here?.y } },
    ],
  },
];

export { viewHereEntries };
