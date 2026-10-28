/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ASSET_SOURCE } from '../../asset-config/asset-source.constants';
import { showForKind } from '../../asset-config/show-for-kind';
import { SUBJECT_META } from '../../asset-config/subject-preview.constants';

const meta: ScreenMeta = {
  ...SUBJECT_META,
  title: 'Tileset',
  icon: 'layers',
  order: 1,
  source: ASSET_SOURCE,
  when: showForKind('tileset'),
  keywords: ['tileset', 'tiles', 'name', 'palette'],
};

const sections: Section[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { key: 'tileset.name', label: 'Name', description: 'The name of the tileset and of its file.', control: { kind: 'text', placeholder: 'Tileset name' } },
    ],
  },
  {
    id: 'palette',
    title: 'Palette',
    items: [
      {
        key: 'palette.name',
        label: 'Palette name',
        description: 'The name of the palette the tiles draw with. Every asset that shares it shows the new name.',
        control: { kind: 'text', placeholder: 'Palette name' },
      },
      { key: 'palette.cap', label: 'Colour limit', description: 'How many slots the palette holds.', hint: 'A new limit shows what changes first.' },
    ],
  },
];

export default sections;
export { meta };
