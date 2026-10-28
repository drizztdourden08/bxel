/* @layer renderer-app @kind constants */
import type { Section } from '@drizztdourden08/brock-react';
import { RANGES } from './canvas-look.constants';
import { RULER_UNIT_LABELS, RULER_UNIT_TEXT, RULER_UNITS } from '../ruler/ruler-unit.constants';
import { OPACITY_CONTROL } from './sections.constants';

const GRID_SECTIONS: Section[] = [
  {
    id: 'grid-pixel',
    title: 'Pixel grid',
    items: [
      { key: 'gridPixel', label: 'Pixel grid', description: 'Draw a line between pixels when zoomed in.', hint: 'View, Pixel grid switches it for the session.' },
      { key: 'gridColor', label: 'Pixel grid colour', description: 'The colour of the pixel grid lines.', control: { kind: 'color' } },
      { key: 'gridOpacity', label: 'Pixel grid opacity', description: 'How strong the pixel grid lines are.', hint: 'Lower values keep the grid out of the way of the art.', control: OPACITY_CONTROL },
    ],
  },
  {
    id: 'grid-major',
    title: 'Major grid',
    items: [
      { key: 'gridMajor', label: 'Major grid', description: 'Draw a stronger line every few pixels.', hint: 'View, Major grid switches it for the session.' },
      { key: 'gridMajorEvery', label: 'Major grid spacing', description: 'Pixels between major lines.', control: { kind: 'number', min: RANGES.major.min, max: RANGES.major.max, step: 1, unit: 'px' } },
      { key: 'gridMajorColor', label: 'Major grid colour', description: 'The colour of the major lines.', hint: 'Pick a colour that stands out from the pixel grid.', control: { kind: 'color' } },
      { key: 'gridMajorOpacity', label: 'Major grid opacity', description: 'How strong the major lines are.', control: OPACITY_CONTROL },
    ],
  },
  {
    id: 'grid-tile',
    title: 'Tile grid',
    items: [
      { key: 'gridTile', label: 'Tile grid', description: 'Draw the boundaries of tiles of a set size.', hint: 'View, Tile grid switches it for the session.' },
      { key: 'gridTileSize', label: 'Tile grid size', description: 'Pixels per tile, across and down.', hint: 'Set it to the tile size of your sheet or map.', control: { kind: 'number', min: RANGES.tile.min, max: RANGES.tile.max, step: 1, unit: 'px' } },
      { key: 'gridTileColor', label: 'Tile grid colour', description: 'The colour of the tile lines.', control: { kind: 'color' } },
      { key: 'gridTileOpacity', label: 'Tile grid opacity', description: 'How strong the tile lines are.', control: OPACITY_CONTROL },
    ],
  },
  {
    id: 'guides',
    title: 'Guides',
    items: [
      {
        key: 'guideColor',
        label: 'Guide colour',
        description: 'The colour of the guide lines pulled out of the rulers.',
        hint: 'Keep it apart from the grid colours so a guide stays easy to see. It applies to sprites, sheets and maps.',
        control: { kind: 'color' },
      },
    ],
  },
  {
    id: 'rulers',
    title: 'Rulers',
    items: [
      {
        key: 'rulers',
        label: 'Show rulers',
        description: 'Draw rulers on the top and left edges of the canvas.',
        hint: 'The rulers show coordinates and hold the handles for the mirror lines. Drag from a ruler to pull out a guide. View, Rulers switches them for the session.',
      },
      {
        key: 'rulerUnit',
        label: RULER_UNIT_TEXT.setting,
        description: RULER_UNIT_TEXT.settingDescription,
        hint: RULER_UNIT_TEXT.settingHint,
        control: { kind: 'choice', look: 'radio', options: RULER_UNITS.map((unit) => ({ value: unit, label: RULER_UNIT_LABELS[unit] })) },
      },
    ],
  },
];

export { GRID_SECTIONS };
