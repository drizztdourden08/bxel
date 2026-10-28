/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Names where the user is editing as a breadcrumb of buttons and menus, with chips for the state of the edit and actions that apply to it.',
  useWhen: [
    'Any asset is open: a sprite, an animation frame, a sheet, a tile being edited or a map.',
  ],
  avoidWhen: [
    { case: 'A message only informs and offers nothing.', use: 'Toast' },
    { case: 'A pending transform waits for a decision.', use: 'ApplyBar' },
  ],
  rules: [
    'It takes no props and reads the document, the selection and the stores.',
    'The first crumb leads back when there is a way back: Sheet from an isolated sprite, Place Tile from Edit Tile.',
    'Chips carry state: Painting N sprites, locked or hidden layer with its fix, Read only, Grid hidden at this zoom. A chip with an action offers the way out.',
    'It replaces the frame bar, the scope bar and the scope group of the Canvas toolbar.',
  ],
  a11y: [
    'The path is a navigation landmark with a list of crumbs; the last one is the current location.',
    'Every crumb with a menu and every action is a button in tab order.',
  ],
  tree: {
    path: ['navigation', 'between views of one area'],
    rule: 'StageHeader is the single strip above the canvas that names the place and the state of the edit.',
  },
  example: `import { StageHeader } from '../StageHeader';

const Stage = () => <StageHeader />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
