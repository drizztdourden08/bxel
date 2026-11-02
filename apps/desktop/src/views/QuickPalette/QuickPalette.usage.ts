/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Opens the tools of the open asset as a sectioned grid at the pointer, so a tool is picked with the hand that stays on the canvas.',
  useWhen: [
    'The editor needs the quick palette that the Quick palette command opens, mounted once with the dialogs.',
    'A tool, a recent tool or a preset must be picked without moving to the rail.',
  ],
  avoidWhen: [{ case: 'Tools sit in a docked bar.', use: 'ToolRail' }],
  rules: [
    'The palette reads the quick palette store for its open state and point, and the tool catalogue for the groups of the open asset.',
    'Rows follow the rail order, then Recent, then the presets of the active tool. Each tool shows its key.',
    'A pick, Escape or a press outside closes it. The held key path waits on held chords in Brock.',
  ],
  a11y: ['The grid is one Tab stop and a listbox. Arrows move, Enter picks, Escape closes and focus returns to where it was.'],
  tree: {
    path: ['something over the page', 'a grid of icons at the pointer, picked by hold and release'],
    rule: 'QuickPalette is the grid of tools that opens at the pointer.',
  },
  example: `import { QuickPalette } from '../QuickPalette';

const Overlays = () => <QuickPalette />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
