/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows one sprite or animation as a tile: a thumbnail on a checker, corner badges, a pick check and the name, with the states of a sheet entry such as active, loose, affected and drop mark.',
  useWhen: [
    'A grid of sprites or animations needs the same tile in the sheet manager and in a library.',
    'An animation must play on its thumbnail while the tile has focus or the pointer.',
  ],
  avoidWhen: [
    { case: 'A generic picture card with a title and no sheet states is enough.', use: 'Tile' },
    { case: 'The entries are shown as text rows.', use: 'DataTable' },
  ],
  rules: [
    'The tile takes its facts, its state, its handlers and its drag entries from the caller and starts a typed drag from them and holds no document state.',
    'A click picks, Ctrl and click toggles, Shift and click extends a range, and a double click opens the entry.',
    'The animation of a tile plays only while the tile is hot, and not at all when the user asks for reduced motion.',
  ],
  a11y: [
    'The tile is named by the entry name, its size or frame count, and the sheets it is on.',
    'A picked tile carries aria-selected and the drop mark is only a visual cue.',
  ],
  tree: {
    path: ['data', 'a list the user reorders, with on and off icons on each row'],
    rule: 'EntryTile is the cell of a thumbnail grid of sheet entries.',
  },
  example: `import type { EntryTileProps } from '../EntryTile/EntryTile.type';
import { EntryTile } from '../EntryTile';

const Cell = (props: EntryTileProps) => <EntryTile {...props} box={48} />;
`,
  propsHash: '641a74ec83964588',
} satisfies ComponentUsage;

export { usage };
