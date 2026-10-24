/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows pixel coordinates along one edge of the canvas, marks the cursor, and holds the handle that moves the mirror line of that axis.',
  useWhen: [
    'The editor canvas shows a ruler on its top edge and another on its left edge, beside the pixel viewport.',
    'The mirror line of an axis must be moved by dragging, with the position snapped to half pixels.',
  ],
  avoidWhen: [
    { case: 'Only the pointer position is shown as text.', use: 'StatusBar' },
    { case: 'A scale for a chart or a value range.', use: 'ScaleLabels' },
  ],
  rules: [
    'Pass axis x for the top ruler and y for the left ruler; place each in the grid cell that touches the viewport.',
    'The ruler reads the view from the ruler store that the canvas fills on each frame, so the ticks follow the zoom and the pan.',
    'Labels sit at least 48 screen pixels apart and thin out as the zoom falls, down to one label per pixel at high zoom.',
    'The handle shows while the mirror of that axis is on. Drag it to move the line; it snaps to a pixel centre or a grid line, and Shift snaps to grid lines only.',
    'Double click the handle to put the line back at the centre.',
  ],
  a11y: [
    'The ruler is a labelled image and is not a Tab stop; the mirror line also moves by dragging its ends on the canvas.',
    'The cursor mark and the handle use the cursor and axis colours of the theme, and a line and a fill.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'CanvasRuler is the coordinate edge of the pixel canvas, with the mirror handle in it.',
  },
  example: `import { CanvasRuler } from '../CanvasRuler';

const Rulers = () => (
  <>
    <CanvasRuler axis="x" />
    <CanvasRuler axis="y" />
  </>
);
`,
  propsHash: 'd81a5ae076c763d5',
} satisfies ComponentUsage;

export { usage };
