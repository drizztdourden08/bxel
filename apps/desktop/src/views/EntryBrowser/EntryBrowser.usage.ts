/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists sprites and animations as thumbnails or rows with a search box, a kind filter, a size control and a count, so the user can find entries and pick them or drag them onto a sheet.',
  useWhen: [
    'The user picks entries from a pool that is not the sheet itself, such as the library of a sheet or the files of the project.',
    'A drop target needs a source that carries sprites and animations as drag entries.',
  ],
  avoidWhen: [
    { case: 'The user manages the entries of one sheet with sorting, folders and batch edits.', use: 'SpritesPanel' },
    { case: 'A plain list of text rows with no thumbnails is enough.', use: 'DataTable' },
  ],
  rules: [
    'The browser holds its own search, kind and view, and never changes the file; the caller owns the pick.',
    'Sprites come first and animations after them, each in natural name order.',
    'A drag starts only when a drag source is given, and it carries the whole pick when the dragged entry is in it.',
    'Enter or a double click activates an entry, and Space toggles its pick.',
  ],
  a11y: [
    'The grid is named by the label prop, each tile is one gridcell, and the count of shown and picked entries is announced politely.',
    'The kind chips form a radio group and the view switch is a segmented control.',
  ],
  tree: {
    path: ['data', 'a list the user reorders, with on and off icons on each row'],
    rule: 'EntryBrowser is the searchable pool of sprites and animations that feeds a sheet.',
  },
  example: `import { useState } from 'react';
import type { Artwork } from '@bxel/document';
import type { EntryFacts } from '../../sheet-manager/manager.type';
import { EntryBrowser } from '../EntryBrowser';

interface PoolProps {
  artwork: Artwork;
  entries: readonly EntryFacts[];
}

const Pool = ({ artwork, entries }: PoolProps) => {
  const [picked, setPicked] = useState<readonly string[]>([]);
  return <EntryBrowser label="Library" artwork={artwork} entries={entries} picked={picked} onPickedChange={setPicked} emptyMessage="Nothing here." />;
};
`,
  propsHash: 'f3f56f77a21b652a',
} satisfies ComponentUsage;

export { usage };
