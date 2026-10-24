/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Switches the editor between Sprite mode and Sheet mode, returns from an isolated sprite, and turns on shared strokes for the picked sprites.',
  useWhen: [
    'The context bar needs the mode switch beside the scope chips.',
    'A sprite was isolated from the sheet and the user must see how to return.',
  ],
  avoidWhen: [
    { case: 'The user chooses one value among a few tools.', use: 'SegmentedControl' },
    { case: 'A setting needs several controls behind one button.', use: 'ControlMenu' },
  ],
  rules: [
    'The bar reads the open file and the sprite store, so it takes no props.',
    'Sheet is off with one sprite and off while a preview is open, and the reason shows as the tooltip.',
    'Paint all selected is off by default and turns off when the picked sprites change.',
  ],
  a11y: [
    'The mode switch is one group named Mode, and a disabled segment says why.',
    'Alt+1 picks Sprite mode, Alt+2 picks Sheet mode, and Alt+B turns shared strokes on or off.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'ModeBar is the mode switch of the editor, with the way back and the shared stroke switch.',
  },
  example: `import { ModeBar } from '../ModeBar';

const ModeRow = () => <ModeBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
