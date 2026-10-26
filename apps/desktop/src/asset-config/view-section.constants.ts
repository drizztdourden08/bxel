/* @layer renderer-app @kind constants */
import type { Section } from '@drizztdourden08/brock-react';

const VIEW_SECTION: Section = {
  id: 'view',
  title: 'Show on the canvas',
  items: [
    { key: 'view.grid', label: 'Pixel grid', description: 'Draw the grid lines when zoomed in.', hint: 'This is a view setting. It does not change the file.' },
    { key: 'view.gridTile', label: 'Tile grid', description: 'Draw the boundaries of tiles of a set size.', hint: 'The tile size and the grid colours are set on the App Canvas page.' },
  ],
};

export { VIEW_SECTION };
