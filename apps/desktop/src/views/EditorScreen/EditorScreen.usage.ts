/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lays out the editor base screen: the context bar on top, the tool rail beside the canvas, and the status line under them.',
  useWhen: [
    'The base screen of the app is the editor for the open document.',
    'The scope chips and the options of the active tool must sit above the canvas.',
  ],
  avoidWhen: [
    { case: 'Panels are docked and moved by the user around the main view.', use: 'DockLayout' },
    { case: 'A list sits beside an editor with unsaved edits guarded.', use: 'ListDetail' },
  ],
  rules: [
    'The screen takes no props and owns the layout only.',
    'The palette and the layers are widgets docked beside it, not parts of this screen.',
    'It also hosts the start-up question about unsaved work, which draws over the editor only when recovery copies exist.',
    'It handles no keys. Every shortcut is a command of the app keymap, so the menus and the shortcut list show it once.',
  ],
  a11y: [
    'The context bar comes first in the tab order, then the tool rail, the canvas, the docked widgets and the status line.',
    'The tool keys, the zoom keys and the history keys work from anywhere in the editor except inside a text field.',
  ],
  tree: {
    path: ['layout', 'an app frame with its navigation'],
    rule: 'EditorScreen is the frame of the editor base screen, with the context bar, the tool rail, the canvas and the status line.',
  },
  example: `import { EditorScreen } from '../EditorScreen';

const EditorBase = () => <EditorScreen />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
