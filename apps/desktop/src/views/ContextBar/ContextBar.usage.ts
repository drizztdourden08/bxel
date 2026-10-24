/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows what the active tool will do on the canvas: the edit scope as read-only chips, then the options of the tool, such as brush size, pixel perfect, fill area, shape kind and symmetry.',
  useWhen: [
    'The editor needs one row above the canvas that names the sprite, layer and frame being edited and holds the options of the active tool.',
    'Tool options must stay on screen while the user draws, with the same keys as the menu.',
  ],
  avoidWhen: [
    { case: 'Settings that apply once, from a dialog or a menu.', use: 'ControlMenu' },
    { case: 'Tools in labelled groups on a top bar.', use: 'ToolGroups' },
  ],
  rules: [
    'The bar reads and writes the tool store and the open document, so it takes no props.',
    'It is one row of fixed height that never wraps: a chip that gets long truncates with an ellipsis and a tooltip with the full text, and a row that is still too wide scrolls sideways.',
    'The scope chips are read-only: Sprite, Layer and Frame. A locked layer shows a lock icon on a danger chip; a hidden layer says so in the chip text.',
    'Only the options of the active tool show. Symmetry shows for the pencil, the eraser and shapes.',
    'Each option has a command with a key, so the bar and the menu change the same store.',
  ],
  a11y: [
    'The bar is a labelled group. Every control has a name that says what it sets.',
    'Segmented controls move with the arrow keys; the size field steps with the arrow keys and takes typed numbers from 1 to 64.',
  ],
  tree: {
    path: ['layout', 'an app frame with its navigation'],
    rule: 'ContextBar is the row of scope chips and tool options above the canvas of the editor.',
  },
  example: `import { ContextBar } from '../ContextBar';

const EditorTop = () => <ContextBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
