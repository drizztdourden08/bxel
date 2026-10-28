/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ASSET_SOURCE } from '../../asset-config/asset-source.constants';
import { showForKind } from '../../asset-config/show-for-kind';
import { SUBJECT_META } from '../../asset-config/subject-preview.constants';

const meta: ScreenMeta = {
  ...SUBJECT_META,
  title: 'Palette',
  icon: 'palette',
  order: 1,
  source: ASSET_SOURCE,
  when: showForKind('palette'),
  keywords: ['palette', 'colours', 'limit', 'transparent', 'swatch set', 'ramps', 'cap'],
};

const sections: Section[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { key: 'palette.name', label: 'Name', description: 'The name of the palette and of its file.', control: { kind: 'text', placeholder: 'Palette name' } },
      { key: 'palette.cap', label: 'Colour limit', description: 'How many slots the palette holds.', hint: 'A new limit shows what changes first.' },
      { key: 'palette.transparent', label: 'Transparent slot', description: 'Slot 0 is transparent.', hint: 'Turning it off asks pixels that used slot 0 to take the first colour.' },
    ],
  },
];

export default sections;
export { meta };
