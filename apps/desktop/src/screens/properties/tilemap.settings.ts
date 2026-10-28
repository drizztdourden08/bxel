/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ASSET_SOURCE } from '../../asset-config/asset-source.constants';
import { showForKind } from '../../asset-config/show-for-kind';

const meta: ScreenMeta = {
  title: 'Tilemap',
  icon: 'map',
  order: 1,
  source: ASSET_SOURCE,
  when: showForKind('tilemap'),
  keywords: ['tilemap', 'map', 'columns', 'rows', 'size', 'layers', 'orientation', 'isometric', 'hexagonal', 'staggered'],
};

const orientationOptions = [
  { value: 'orthogonal', label: 'Orthogonal' },
  { value: 'isometric', label: 'Isometric' },
  { value: 'staggered', label: 'Staggered' },
  { value: 'hexagonal', label: 'Hexagonal' },
];

const sections: Section[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { key: 'tilemap.name', label: 'Name', description: 'The name of the map and of its file.', control: { kind: 'text', placeholder: 'Map name' } },
      {
        key: 'tilemap.size',
        label: 'Map size',
        description: 'Tiles across and down.',
        hint: 'A smaller map cuts the right and the bottom edges.',
      },
    ],
  },
  {
    id: 'orientation',
    title: 'Orientation',
    items: [
      {
        key: 'tilemap.orientation',
        label: 'Orientation',
        description: 'How the grid is laid out and how tiles are picked under the pointer.',
        hint: 'Isometric, staggered and hexagonal maps need an even tile size. Cells keep their tiles.',
        control: { kind: 'select', options: orientationOptions },
      },
      {
        key: 'tilemap.staggerAxis',
        label: 'Stagger axis',
        description: 'Y shifts every other row, X shifts every other column.',
        control: { kind: 'select', options: [{ value: 'y', label: 'Rows shift' }, { value: 'x', label: 'Columns shift' }] },
        visible: (settings) => settings['tilemap.orientation'] === 'staggered' || settings['tilemap.orientation'] === 'hexagonal',
      },
      {
        key: 'tilemap.staggerIndex',
        label: 'Shifted lines',
        description: 'Whether the odd or the even lines are shifted.',
        control: { kind: 'select', options: [{ value: 'odd', label: 'Odd lines' }, { value: 'even', label: 'Even lines' }] },
        visible: (settings) => settings['tilemap.orientation'] === 'staggered' || settings['tilemap.orientation'] === 'hexagonal',
      },
      {
        key: 'tilemap.hexSide',
        label: 'Hexagon side',
        description: 'The length of the straight side of a hexagon, in pixels.',
        control: { kind: 'number', min: 1, max: 2048, step: 1, unit: 'px' },
        visible: (settings) => settings['tilemap.orientation'] === 'hexagonal',
      },
    ],
  },
];

export default sections;
export { meta };
