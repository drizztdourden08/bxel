/* @layer renderer-app @kind constants */
import { defineWorkspace } from '@drizztdourden08/brock-react';
import { WORKSPACE_FLAG } from '../ui-context/widget-context.constants';

const SHEET_WORKSPACE = defineWorkspace({
  id: 'sheet',
  label: 'Sheet',
  icon: 'pixel-atlas',
  order: 1,
  when: { when: (context) => context.flags[WORKSPACE_FLAG.sheet] === true },
  layout: {
    rows: [
      ['main', 'palette'],
      ['timeline', 'sprites', 'tileset'],
    ],
    widths: [[0.8, 0.2], [0.5, 0.3, 0.2]],
    sizes: [0.55, 0.45],
  },
});

export { SHEET_WORKSPACE };
