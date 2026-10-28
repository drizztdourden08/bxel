/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Teaches and tunes the tools: every tool by group with its icon, name, one line and key, the options of the active tool under its row, the recent tools, the presets and the tool preferences.',
  useWhen: [
    'The person wants to learn the keys of the tools, see every variant at once or change how the tool menus behave.',
    'The person wants to bring a tool back to the rail after hiding it.',
  ],
  avoidWhen: [
    { case: 'The person only picks a tool while drawing.', use: 'ToolRail' },
    { case: 'The person wants every option of the active tool.', use: 'OptionsPanel' },
  ],
  rules: [
    'It takes no props. It reads the tool catalogue for the open asset, so a map lists the map tools and a sheet lists Zoom and Hand.',
    'Rows come in groups with a heading. A slot with variants has a header with its key and one row per variant. The key of every slot is always visible.',
    'The active variant is lit and its tier one options sit under its row, from the same option model as the Tool options bar.',
    'Recent shows the last five tools picked on this kind of asset. Presets lists the presets of the active tool. A right click on a row opens the same menu as the rail.',
    'Preferences hold Open tool menus on hover, the hold delay, sharing the brush between tools and a way to show every hidden tool on the rail again.',
  ],
  a11y: [
    'Each group is a labelled region and each slot with variants is a labelled group. Rows are buttons that report pressed.',
    'With no asset open the rows are disabled and a note says why.',
  ],
  tree: {
    path: ['actions', 'several related buttons', 'tools in groups, each under a small label'],
    rule: 'ToolsPanel is the wide, learning form of the tool rail.',
  },
  example: `import { ToolsPanel } from '../ToolsPanel';

const ToolsWidget = () => <ToolsPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
