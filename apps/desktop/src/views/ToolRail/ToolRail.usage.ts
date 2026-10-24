/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the tools of the editor as a column of pixel art icon buttons, with the active tool lit and a menu that opens to the right on hover for the tools that have options.',
  useWhen: [
    'The editor needs one place to pick the tool, such as the pencil, the eraser, the fill, the picker, the shapes, the zoom or the hand.',
    'Each tool has a single key and the rail must teach it in a hint, never on the button.',
  ],
  avoidWhen: [
    { case: 'Tools sit in labelled groups on a top bar.', use: 'ToolGroups' },
    { case: 'A few related actions share one horizontal row.', use: 'ButtonGroup' },
  ],
  rules: [
    'The rail reads and writes the tool in the tool store, so it takes no props.',
    'Each button is named with the tool, such as Pencil. Its hint shows the name, a one line description and the key, read from the keymap so a rebind shows up. In tilemap placing mode the rail is a set of button groups whose hints open to the right.',
    'The active tool is the pressed button; pressing another tool replaces it. Pressing the key of the active tool again cycles its variants, such as line, rectangle and ellipse.',
    'Shapes and Select open a menu to the right on hover with their options, each with a description.',
  ],
  a11y: [
    'The rail is a toolbar named Tools whose buttons report pressed, each with an accessible name that holds the tool.',
    'The buttons are reached with Tab and pressed with Enter or Space; the tool keys work from anywhere in the editor.',
  ],
  tree: {
    path: ['actions', 'several related buttons', 'peer actions on one thing, read as one tool'],
    rule: 'ToolRail is the vertical group of tool buttons of the editor, bound to the tool store.',
  },
  example: `import { ToolRail } from '../ToolRail';

const EditorSide = () => <ToolRail />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
