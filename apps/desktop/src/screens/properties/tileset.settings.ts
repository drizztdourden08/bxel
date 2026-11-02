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
  keywords: ['tileset', 'tiles', 'name', 'palette', 'tile size', 'columns', 'grid', 'collision', 'layers', 'data', 'fields'],
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
    id: 'grid',
    title: 'Tile grid',
    items: [
      { key: 'tileset.tileSize', label: 'Tile size', description: 'The width and height of every tile, in pixels.', hint: 'The size is set when the tileset is made.' },
      {
        key: 'tileset.columns',
        label: 'Grid columns',
        description: 'How many tiles sit in one row of the tile grid. An imported sheet keeps the columns it was drawn in.',
        hint: 'Tiles keep their place; empty places stay empty.',
        control: { kind: 'number', min: 1, max: 64, step: 1 },
      },
    ],
  },
  {
    id: 'collision',
    title: 'Collision layers',
    items: [
      {
        key: 'tileset.collisionLayers',
        label: 'Layer names',
        description: 'The named layers a collision shape can sit on, separated by commas. The first one is the default.',
        hint: 'A shape on a layer you remove moves to the first layer.',
        control: { kind: 'text', placeholder: 'solid, water, hurt' },
      },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    items: [
      {
        key: 'tileset.dataFields',
        label: 'Custom fields',
        description: 'The custom values every tile can carry, as name:kind separated by commas. Kinds are bool, int, number, text, colour and choice(a|b|c).',
        hint: 'A field you keep keeps its default and its tile values; a field you remove drops its values.',
        control: { kind: 'text', placeholder: 'hp:int, tag:text, ground:choice(stone|water)' },
      },
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
