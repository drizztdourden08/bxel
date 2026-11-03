/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the whole open asset as a small picture with a frame around the part the canvas shows, so the user sees where they are and drags the frame to move there.',
  useWhen: [
    'A large sprite, sheet or map is open and the user needs to jump to another part of it.',
    'The user wants to see the selection and the visible area against the whole asset.',
  ],
  avoidWhen: [
    { case: 'The user types an exact zoom.', use: 'CanvasToolbar' },
    { case: 'A picture that does not follow a canvas.', use: 'Image' },
  ],
  rules: [
    'It takes no props. It reads the view the canvas last painted from the view feed store and moves the canvas through the viewport handle. The map is a Tessera Navigator.',
    'Drag the frame to pan, click outside it to centre there, turn the wheel over it to zoom at that point.',
    'The picture is the real image of the asset, scaled to fit. The selection is a dashed box and the other view of a split is a dotted box.',
  ],
  a11y: [
    'The frame is one Tab stop, a slider named Visible area, and a screen reader hears the visible range and the zoom with it.',
    'Arrow keys move the frame by an eighth of its width, Shift by five times that. Plus and Minus zoom and Home fits.',
    'The zoom and the share shown are written as text under the picture.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'Navigator is the overview of the open asset, with the visible area as a draggable frame.',
  },
  example: `import { Navigator } from '../Navigator';

const Side = () => <Navigator />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
