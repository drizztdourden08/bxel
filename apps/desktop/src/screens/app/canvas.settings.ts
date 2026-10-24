/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { CHECKER_PRESET_LABELS, CHECKER_PRESETS, RANGES, SURROUND_KINDS, SURROUND_LABELS } from '../../canvas-look/canvas-look.constants';

const meta: ScreenMeta = { title: 'Canvas', icon: 'image', order: 2, keywords: ['checkerboard', 'transparency', 'grid', 'ruler', 'background', 'pattern'] };

const checkerOptions = CHECKER_PRESETS.map((preset) => ({ value: preset, label: CHECKER_PRESET_LABELS[preset] }));

const surroundOptions = SURROUND_KINDS.map((kind) => ({ value: kind, label: SURROUND_LABELS[kind] }));

const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

const sections: Section[] = [
  {
    id: 'checkerboard',
    title: 'Checkerboard',
    items: [
      {
        key: 'checkerA',
        label: 'Checkerboard colour A',
        description: 'The first colour behind transparent pixels.',
        hint: 'Transparent pixels show a checkerboard of two colours. This is the first one.',
        control: { kind: 'color' },
      },
      {
        key: 'checkerB',
        label: 'Checkerboard colour B',
        description: 'The second colour behind transparent pixels.',
        hint: 'This is the second colour of the checkerboard.',
        control: { kind: 'color' },
      },
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
        hint: 'Used when the cell size is Custom.',
        control: { kind: 'number', min: RANGES.checkerSize.min, max: RANGES.checkerSize.max, step: 1, unit: 'px' },
        visible: (settings) => settings.checkerPreset === 'custom',
      },
    ],
  },
  {
    id: 'surround',
    title: 'Surround',
    items: [
      {
        key: 'surroundPattern',
        label: 'Surround pattern',
        description: 'The texture around the canvas.',
        hint: 'Pick a stripe, dot or solid texture. Custom uses the 16 by 16 pattern you draw on the Canvas surround page.',
        control: { kind: 'select', options: surroundOptions },
      },
      {
        key: 'surroundA',
        label: 'Surround colour A',
        description: 'The base colour of the surround.',
        hint: 'Keep it close to colour B so the texture stays quiet.',
        control: { kind: 'color' },
      },
      {
        key: 'surroundB',
        label: 'Surround colour B',
        description: 'The colour of the pattern marks.',
        hint: 'The marked cells of the pattern use this colour.',
        control: { kind: 'color' },
      },
      {
        key: 'surroundScale',
        label: 'Surround pattern size',
        description: 'Screen pixels per pattern cell.',
        hint: 'Larger values make the texture coarser.',
        control: { kind: 'range', min: RANGES.surroundScale.min, max: RANGES.surroundScale.max, step: 1, format: (value: number) => `${value} px` },
      },
    ],
  },
  {
    id: 'grid',
    title: 'Grid',
    items: [
      {
        key: 'gridPixel',
        label: 'Pixel grid',
        description: 'Draw a line between pixels when zoomed in.',
        hint: 'On, the grid shows at high zoom. View, Pixel grid switches it for the session.',
      },
      {
        key: 'gridColor',
        label: 'Pixel grid colour',
        description: 'The colour of the pixel grid lines.',
        hint: 'The lines use this colour at the opacity below.',
        control: { kind: 'color' },
      },
      {
        key: 'gridOpacity',
        label: 'Pixel grid opacity',
        description: 'How strong the pixel grid lines are.',
        hint: 'Lower values keep the grid out of the way of the art.',
        control: { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent },
      },
      {
        key: 'gridMajor',
        label: 'Major grid',
        description: 'Draw a stronger line every few pixels.',
        hint: 'On, a line shows every N pixels. View, Major grid switches it for the session.',
      },
      {
        key: 'gridMajorEvery',
        label: 'Major grid spacing',
        description: 'Pixels between major lines.',
        hint: 'A major line falls on every multiple of this number.',
        control: { kind: 'number', min: RANGES.major.min, max: RANGES.major.max, step: 1, unit: 'px' },
      },
      {
        key: 'gridMajorColor',
        label: 'Major grid colour',
        description: 'The colour of the major lines.',
        hint: 'Pick a colour that stands out from the pixel grid.',
        control: { kind: 'color' },
      },
      {
        key: 'gridMajorOpacity',
        label: 'Major grid opacity',
        description: 'How strong the major lines are.',
        hint: 'Drag to make the major lines stronger or softer.',
        control: { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent },
      },
      {
        key: 'gridTile',
        label: 'Tile grid',
        description: 'Draw the boundaries of tiles of a set size.',
        hint: 'On, a line shows every tile size. View, Tile grid switches it for the session.',
      },
      {
        key: 'gridTileSize',
        label: 'Tile grid size',
        description: 'Pixels per tile, across and down.',
        hint: 'Set it to the tile size of your sheet or map.',
        control: { kind: 'number', min: RANGES.tile.min, max: RANGES.tile.max, step: 1, unit: 'px' },
      },
      {
        key: 'gridTileColor',
        label: 'Tile grid colour',
        description: 'The colour of the tile lines.',
        hint: 'Pick a colour that stands out from the other grids.',
        control: { kind: 'color' },
      },
      {
        key: 'gridTileOpacity',
        label: 'Tile grid opacity',
        description: 'How strong the tile lines are.',
        hint: 'Drag to make the tile lines stronger or softer.',
        control: { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent },
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
