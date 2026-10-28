/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the whole open asset as a small picture with a frame around the part the canvas shows, so the user sees where they are and drags the frame to move there.',
  useWhen: [
    'A large sprite, sheet or map is open and the user needs to jump to another part of it.',
    'The user wants to see the selection and the visible area against the whole asset.',
  ],
  avoidWhen: [
    { case: 'The user types an exact zoom.', use: 'ZoomField' },
    { case: 'A picture that does not follow a canvas.', use: 'Image' },
  ],
  rules: [
    'It takes no props. It reads the view the canvas last painted from the view feed store and moves the canvas through the viewport handle.',
    'Drag the frame to pan, click outside it to centre there, turn the wheel over it to zoom.',
    'The picture is the real image of the asset, scaled to fit, with the selection as a dashed box.',
  ],
  a11y: [
    'The picture is one Tab stop, an application region named Visible area.',
    'Arrow keys move the frame by an eighth of its size, Shift by a whole frame. Plus and Minus zoom and Home fits.',
    'The visible range and the zoom are written as text under the picture.',
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
