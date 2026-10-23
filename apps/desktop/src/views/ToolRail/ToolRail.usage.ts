/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the drawing tools of the editor as a vertical rail of lettered buttons, with the active tool lit.',
  useWhen: [
    'The editor needs one place to pick the drawing tool, such as the pencil, the eraser, the fill or the picker.',
    'Each tool has a single key and the rail must show it next to the tool name.',
  ],
  avoidWhen: [
    { case: 'Tools sit in labelled groups on a top bar.', use: 'ToolGroups' },
    { case: 'A few related actions share one horizontal row.', use: 'ButtonGroup' },
  ],
  rules: [
    'The rail reads and writes the tool in the tool store, so it takes no props.',
    'Each button is named with the tool and its key, such as Pencil (B), and the same text is its tooltip.',
    'The active tool is the pressed button; pressing another tool replaces it.',
  ],
  a11y: [
    'The rail is a labelled group of buttons, each with an accessible name that holds the tool and its key.',
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
