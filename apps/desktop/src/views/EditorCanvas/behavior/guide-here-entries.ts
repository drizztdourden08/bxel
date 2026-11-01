/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { CANVAS_MENU } from '../EditorCanvas.constants';

const guideHereEntries = (here: Point | null): ContextMenuEntry => ({
  label: CANVAS_MENU.addGuide,
  hidden: here === null,
  items: [
    { command: 'guide.add_here', label: CANVAS_MENU.guideX, args: { axis: 'x', position: here?.x } },
    { command: 'guide.add_here', label: CANVAS_MENU.guideY, args: { axis: 'y', position: here?.y } },
  ],
});

export { guideHereEntries };
