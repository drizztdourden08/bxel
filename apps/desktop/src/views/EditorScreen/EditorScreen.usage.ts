/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lays out the editor base screen: the tool rail beside the canvas, the status line under them, and the editor keys.',
  useWhen: [
    'The base screen of the app is the editor for the open document.',
    'The tool keys, X, Ctrl+Z and Ctrl+Y must work while focus is anywhere in the editor.',
  ],
  avoidWhen: [
    { case: 'Panels are docked and moved by the user around the main view.', use: 'DockLayout' },
    { case: 'A list sits beside an editor with unsaved edits guarded.', use: 'ListDetail' },
  ],
  rules: [
    'The screen takes no props and owns the layout and the key handling only.',
    'The palette is a widget docked beside it, not a part of this screen.',
    'It also hosts the start-up question about unsaved work, which draws over the editor only when recovery copies exist.',
    'It handles Ctrl+Z, Ctrl+Y and Ctrl+Shift+Z itself so no toast listener takes them.',
  ],
  a11y: [
    'The tool rail comes first in the tab order, then the canvas, then the docked widgets and the status line.',
    'The keys are ignored when a modifier other than Ctrl is held.',
  ],
  tree: {
    path: ['layout', 'an app frame with its navigation'],
    rule: 'EditorScreen is the frame of the editor base screen, with the tool rail, the canvas and the status line.',
  },
  example: `import { EditorScreen } from '../EditorScreen';

const EditorBase = () => <EditorScreen />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
