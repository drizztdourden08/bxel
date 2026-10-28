/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Is the inspector of the active tool: a head with a brush preview, the tool and its preset, then every option in sections with its description and reset, the presets and Reset all tools.',
  useWhen: [
    'The person wants every option of the tool with a label and a sentence, or wants to manage presets.',
    'The Tool options bar folded options away or the person opened More.',
  ],
  avoidWhen: [
    { case: 'The person changes the common options while drawing.', use: 'OptionsToolbar' },
    { case: 'The person learns the tools and their keys.', use: 'ToolsPanel' },
  ],
  rules: [
    'It takes no props. The options come from the option model of the tool in the tool store, the same list as the bar, the menus and the commands.',
    'Options are grouped under small headings. An option that differs from its default shows a changed mark and a reset. A disabled option says why in its description.',
    'The head shows the brush for Pencil, Eraser and Shapes at the current size and tip, and the preset name or Custom. Save as preset and Reset tool sit in the head.',
    'A sheet says to pick a sprite to paint. With no asset open it says there is no tool here.',
  ],
  a11y: ['Each section is a labelled region. Every row is a labelled control with its description tied to it.'],
  tree: {
    path: ['a value the user sets', 'one option in a long form, with a reset'],
    rule: 'OptionsPanel is the form of every option of the active tool.',
  },
  example: `import { OptionsPanel } from '../OptionsPanel';

const OptionsWidget = () => <OptionsPanel />;
`,
  propsHash: '0000000000000000',
} satisfies ComponentUsage;

export { usage };
