/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks for the name and size of a new tileset or a new tilemap and creates it through the command engine.',
  useWhen: [
    'The user starts a map and the file has no tileset or no tilemap yet.',
    'A second tileset or map is added to the open file.',
  ],
  avoidWhen: [
    { case: 'A new sprite or a new file is created.', use: 'CreateDialog' },
    { case: 'A short confirmation with two buttons is enough.', use: 'Dialog' },
  ],
  rules: [
    'The dialog reads the tilemap dialog store, so it takes no props.',
    'A refused name or size shows the engine message inside the dialog and nothing is created.',
    'A diagonal flip, and so a turn, needs square tiles.',
  ],
  a11y: [
    'The dialog keeps the focus, Escape and title naming of DialogShell.',
    'Each size field has its own label, so a screen reader reads width and height apart.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'TilemapDialog is the form that creates a tileset or a tilemap.',
  },
  example: `import { TilemapDialog } from '../TilemapDialog';

const Host = () => <TilemapDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
