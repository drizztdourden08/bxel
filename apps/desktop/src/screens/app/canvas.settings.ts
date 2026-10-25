/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { CHECKER_PRESET_LABELS, CHECKER_PRESETS, RANGES, SURROUND_KINDS, SURROUND_LABELS } from '../../canvas-look/canvas-look.constants';

const meta: ScreenMeta = {
  title: 'Canvas',
  icon: 'image',
  order: 2,
  keywords: ['checkerboard', 'transparency', 'grid', 'ruler', 'background', 'pattern', 'surround', 'stripes', 'custom', 'preview', 'sixteen'],
};

const checkerOptions = CHECKER_PRESETS.map((preset) => ({ value: preset, label: CHECKER_PRESET_LABELS[preset] }));

const surroundOptions = SURROUND_KINDS.map((kind) => ({ value: kind, label: SURROUND_LABELS[kind] }));

const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

const opacity = { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent } as const;

const sections: Section[] = [
  {
    id: 'background',
    title: 'Background',
    subsections: [
      {
        id: 'background-preview',
        title: 'Preview',
        items: [{ key: 'canvas.backgroundPreview', layout: 'wide', label: 'Background preview', description: 'The checkerboard inside the surround, as the canvas shows them.', hint: 'It changes as you edit the rows below.' }],
      },
      {
        id: 'checkerboard',
        title: 'Checkerboard',
        items: [
          { key: 'checkerA', label: 'Checkerboard colour A', description: 'The first colour behind transparent pixels.', hint: 'Transparent pixels show a checkerboard of two colours.', control: { kind: 'color' } },
          { key: 'checkerB', label: 'Checkerboard colour B', description: 'The second colour behind transparent pixels.', control: { kind: 'color' } },
          {
            key: 'checkerPreset',
            label: 'Checkerboard cell size',
            description: 'The size of one cell, in screen pixels.',
            hint: 'Pick a size, or Custom to type one. The size stays the same at every zoom.',
            control: { kind: 'choice', options: checkerOptions },
          },
          {
            key: 'checkerSize',
            label: 'Custom cell size',
            description: 'Screen pixels per checkerboard cell.',
            control: { kind: 'number', min: RANGES.checkerSize.min, max: RANGES.checkerSize.max, step: 1, unit: 'px' },
            visible: (settings) => settings.checkerPreset === 'custom',
          },
        ],
      },
      {
        id: 'surround',
        title: 'Surround',
        items: [
          { key: 'surroundPattern', label: 'Surround pattern', description: 'The texture around the canvas.', hint: 'Pick a stripe, dot or solid texture, or Custom to use the pattern you draw below.', control: { kind: 'select', options: surroundOptions } },
          { key: 'surroundA', label: 'Surround colour A', description: 'The base colour of the surround.', hint: 'Keep it close to colour B so the texture stays quiet.', control: { kind: 'color' } },
          { key: 'surroundB', label: 'Surround colour B', description: 'The colour of the pattern marks.', control: { kind: 'color' } },
          {
            key: 'surroundScale',
            label: 'Surround pattern size',
            description: 'Screen pixels per pattern cell.',
            hint: 'Larger values make the texture coarser.',
            control: { kind: 'range', min: RANGES.surroundScale.min, max: RANGES.surroundScale.max, step: 1, format: (value: number) => `${value} px` },
          },
          {
            key: 'canvas.surroundCustom', layout: 'wide',
            label: 'Custom pattern',
            description: 'Click or drag cells to switch them between the two surround colours.',
            hint: 'Drawing a cell makes the pattern Custom. The arrow keys move the cell and Space switches it.',
          },
        ],
      },
    ],
  },
  {
    id: 'grid',
    title: 'Grid',
    subsections: [
      {
        id: 'grid-preview',
        title: 'Preview',
        items: [{ key: 'canvas.gridPreview', layout: 'wide', label: 'Grid preview', description: 'The grids that are on, over the checkerboard at a high zoom.', hint: 'It changes as you edit the rows below.' }],
      },
      {
        id: 'grid-pixel',
        title: 'Pixel grid',
        items: [
          { key: 'gridPixel', label: 'Pixel grid', description: 'Draw a line between pixels when zoomed in.', hint: 'View, Pixel grid switches it for the session.' },
          { key: 'gridColor', label: 'Pixel grid colour', description: 'The colour of the pixel grid lines.', control: { kind: 'color' } },
          { key: 'gridOpacity', label: 'Pixel grid opacity', description: 'How strong the pixel grid lines are.', hint: 'Lower values keep the grid out of the way of the art.', control: opacity },
        ],
      },
      {
        id: 'grid-major',
        title: 'Major grid',
        items: [
          { key: 'gridMajor', label: 'Major grid', description: 'Draw a stronger line every few pixels.', hint: 'View, Major grid switches it for the session.' },
          { key: 'gridMajorEvery', label: 'Major grid spacing', description: 'Pixels between major lines.', control: { kind: 'number', min: RANGES.major.min, max: RANGES.major.max, step: 1, unit: 'px' } },
          { key: 'gridMajorColor', label: 'Major grid colour', description: 'The colour of the major lines.', hint: 'Pick a colour that stands out from the pixel grid.', control: { kind: 'color' } },
          { key: 'gridMajorOpacity', label: 'Major grid opacity', description: 'How strong the major lines are.', control: opacity },
        ],
      },
      {
        id: 'grid-tile',
        title: 'Tile grid',
        items: [
          { key: 'gridTile', label: 'Tile grid', description: 'Draw the boundaries of tiles of a set size.', hint: 'View, Tile grid switches it for the session.' },
          { key: 'gridTileSize', label: 'Tile grid size', description: 'Pixels per tile, across and down.', hint: 'Set it to the tile size of your sheet or map.', control: { kind: 'number', min: RANGES.tile.min, max: RANGES.tile.max, step: 1, unit: 'px' } },
          { key: 'gridTileColor', label: 'Tile grid colour', description: 'The colour of the tile lines.', control: { kind: 'color' } },
          { key: 'gridTileOpacity', label: 'Tile grid opacity', description: 'How strong the tile lines are.', control: opacity },
        ],
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
        hint: 'The rulers show pixel coordinates and hold the handles for the mirror lines. View, Rulers switches them for the session.',
      },
    ],
  },
];

export default sections;
export { meta };
