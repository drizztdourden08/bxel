/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ASSET_SOURCE } from '../../asset-config/asset-source.constants';
import { showForKind } from '../../asset-config/show-for-kind';

const meta: ScreenMeta = {
  title: 'Palette',
  icon: 'palette',
  order: 2,
  source: ASSET_SOURCE,
  when: showForKind('sprite'),
  keywords: ['palette', 'colours', 'colour limit', 'swatch set', 'transparent', 'background', 'remap', 'project palette'],
};

const sections: Section[] = [
  {
    id: 'palette',
    title: 'Palette of this sprite',
    items: [
      {
        key: 'sprite.bank',
        label: 'Palette',
        description: 'The palette the sprite draws with. It can be its own palette or a palette file of the project.',
        hint: 'Moving to another palette shows what changes first. Each colour keeps its slot number.',
      },
      {
        key: 'palette.name',
        label: 'Palette name',
        description: 'The name of this palette. Every sprite that shares it shows the new name.',
        control: { kind: 'text', placeholder: 'Palette name' },
      },
      {
        key: 'palette.cap',
        label: 'Colour limit',
        description: 'How many slots the palette holds.',
        hint: 'A new limit shows what changes first. It is one undo step.',
      },
      {
        key: 'palette.transparent',
        label: 'Transparent slot',
        description: 'Slot 0 is transparent. Off, slot 0 is a plain background colour.',
        hint: 'Turning it off asks pixels that used slot 0 to take the first colour.',
      },
    ],
  },
];

export default sections;
export { meta };
