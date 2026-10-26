/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { CANVAS_MENU } from '../EditorCanvas.constants';

const pickHereEntries = (here: Point | null): ContextMenuEntry => ({
  label: CANVAS_MENU.pickHere,
  hidden: here === null,
  items: CANVAS_MENU.slots.map((slot) => ({
    command: 'palette.pick_here',
    label: CANVAS_MENU.asColour(slot),
    args: { slot, x: here?.x, y: here?.y },
  })),
});

export { pickHereEntries };
