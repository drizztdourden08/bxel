/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows which sprite, layer and frame the next edit changes, as a strip of chips above the status bar, with menus to widen the scope when several sprites are selected.',
  useWhen: [
    'The user needs to see what a stroke or a fill will change before drawing.',
    'In Tilemap mode the user needs to see the map, the layer, the turn of the tile and the selected cells.',
  ],
  avoidWhen: [
    { case: 'The user picks the mode, a view option or the tool.', use: 'CanvasToolbar' },
    { case: 'The text is the position of the pointer or the zoom.', use: 'EditorStatus' },
  ],
  rules: [
    'The strip has a fixed height, so a longer name never moves the canvas. A chip that is too long is cut and its hint holds the full text.',
    'A locked layer shows the lock icon, and a hidden or locked layer takes the danger tone.',
    'With two or more sprites selected the chips become menus for the sprites, layers and frames, and they turn off while an edit waits for Apply.',
    'The painting chip shows how many sprites a stroke reaches while Paint all selected is on.',
  ],
  a11y: [
    'The chips are a group named Edit scope. Each chip has a hint that holds its full text.',
  ],
  tree: {
    path: ['layout', 'window chrome', 'the status line at the foot'],
    rule: 'ScopeBar is the strip of chips that names the target of the next edit of the editor.',
  },
  example: `import { ScopeBar } from '../ScopeBar';

const EditorFoot = () => <ScopeBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
