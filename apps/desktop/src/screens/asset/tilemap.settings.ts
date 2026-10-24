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
  keywords: ['tilemap', 'map', 'columns', 'rows', 'size', 'layers'],
};

const sections: Section[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { key: 'tilemap.name', label: 'Name', description: 'The name of the map and of its file.', control: { kind: 'text', placeholder: 'Map name' } },
      { key: 'tilemap.columns', label: 'Columns', description: 'Tiles across.', hint: 'A smaller map cuts the right edge.', control: { kind: 'number', min: 1, max: 1024, step: 1 } },
      { key: 'tilemap.rows', label: 'Rows', description: 'Tiles down.', hint: 'A smaller map cuts the bottom edge.', control: { kind: 'number', min: 1, max: 1024, step: 1 } },
    ],
  },
];

export default sections;
export { meta };
