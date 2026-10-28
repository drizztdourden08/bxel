/* @layer renderer-app @kind constants */
import type { ToolDef } from './tool.type';

/*
 * The adapter between the drawing tools and the tool catalogue. When the catalogue and the option model land,
 * register DRAWING_TOOLS there and the option kinds of TOOL_OPTIONS in OptionsToolbar.constants.ts and delete this file and the DRAWING_TOOLS import in
 * tools.constants.ts. The options themselves live in useDrawingStore.
 */
const DRAWING_TOOLS: readonly ToolDef[] = [
  { id: 'spray', label: 'Spray', description: 'Spray random dots in a disc while the button is held. Hold still to build up density.', key: 'Shift+B', group: 'draw' },
  { id: 'gradient', label: 'Gradient', description: 'Drag a line to fill the selection, or the whole cel, with a ramp. Hold Shift to snap the angle.', key: 'Shift+G', group: 'draw' },
  { id: 'line', label: 'Line', description: 'Draw a straight line. Shift snaps to clean ratios, Alt draws from the centre, Space moves it.', key: 'L', group: 'draw' },
  { id: 'curve', label: 'Curve', description: 'Drag the ends, release, then move to bend the curve and click to finish. Enter finishes, Escape cancels.', key: 'Shift+L', group: 'draw' },
  { id: 'rect', label: 'Rectangle', description: 'Draw a rectangle. Shift keeps it square, Alt draws from the centre, Space moves it. Press U again to toggle filled.', key: 'U', group: 'draw' },
  { id: 'ellipse', label: 'Ellipse', description: 'Draw an ellipse. Shift keeps it round, Alt draws from the centre, Space moves it.', key: 'Shift+U', group: 'draw' },
  { id: 'contour', label: 'Contour', description: 'Draw a free outline. It closes and fills when you release.', key: 'D', group: 'draw' },
  { id: 'polygon', label: 'Polygon', description: 'Click each corner. Enter or a double click closes it, Backspace removes the last corner, Escape cancels.', key: 'Shift+D', group: 'draw' },
];

export { DRAWING_TOOLS };
