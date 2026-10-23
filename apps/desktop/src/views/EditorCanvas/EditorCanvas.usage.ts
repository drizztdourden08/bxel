/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the open sprite in a zoomable pixel viewport and turns pointer input into drawing, filling and picking.',
  useWhen: [
    'The editor draws the active sprite and lets the user paint it pixel by pixel.',
    'A stroke must show live while the pointer moves and become one undo step when it ends.',
  ],
  avoidWhen: [
    { case: 'A picture is only looked at, with no drawing tools.', use: 'PixelViewport' },
    { case: 'A picture opens large over the page.', use: 'MediaViewer' },
  ],
  rules: [
    'The canvas reads the active document and the tool store, so it takes no props.',
    'The pencil and the eraser draw a live overlay while the pointer moves and send one transaction on release.',
    'The fill and the picker act on the press; Alt with a press picks a colour with any tool.',
    'The right button uses the back colour for the pencil and the fill.',
  ],
  a11y: [
    'The viewport is one Tab stop named Sprite canvas, with the zoom announced when it settles.',
    'The tool keys, X, Ctrl+Z and Ctrl+Y work while focus is anywhere in the editor.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'EditorCanvas is the pixel drawing surface of the editor, with the tools wired to the document.',
  },
  example: `import { EditorCanvas } from '../EditorCanvas';

const EditorBody = () => <EditorCanvas />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
