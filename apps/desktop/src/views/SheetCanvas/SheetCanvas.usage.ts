/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows every sprite of the open file at its place on the sheet in a zoomable pixel viewport, and turns pointer input into picking, moving and slicing.',
  useWhen: [
    'The editor is in Sheet mode and the user picks sprites by click, Ctrl and click, or Shift and click.',
    'A group edit must show its result on every picked sprite before it is applied.',
  ],
  avoidWhen: [
    { case: 'One sprite is drawn pixel by pixel.', use: 'EditorCanvas' },
    { case: 'A picture is only looked at, with no tools.', use: 'PixelViewport' },
  ],
  rules: [
    'The canvas reads the active document and the sprite store, so it takes no props.',
    'A drag moves the picked sprites on the sheet and never changes a pixel inside a sprite.',
    'Sprites that overlap on the sheet show a warning tint where they cross.',
    'A double click or Enter isolates one sprite in Sprite mode, and Escape or the Back chip returns.',
  ],
  a11y: [
    'The viewport is one Tab stop named Sheet canvas, with the zoom announced when it settles.',
    'The arrow keys move the picked sprites by 1 pixel, and Shift with an arrow moves them by 8.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'SheetCanvas is the sheet drawing surface of the editor, with picking and layout wired to the document.',
  },
  example: `import { SheetCanvas } from '../SheetCanvas';

const SheetBody = () => <SheetCanvas />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
