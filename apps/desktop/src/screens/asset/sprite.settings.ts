/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ASSET_SOURCE } from '../../asset-config/asset-source.constants';
import { runInEditor } from '../../asset-config/run-in-editor';
import { showForKind } from '../../asset-config/show-for-kind';
import { FILE_COMMAND } from '../../files/files.constants';

const meta: ScreenMeta = {
  title: 'Sprite',
  icon: 'image',
  order: 1,
  source: ASSET_SOURCE,
  when: showForKind('sprite'),
  keywords: ['sprite', 'name', 'size', 'resize', 'pivot', 'frame', 'duration', 'grid', 'export'],
};

const sections: Section[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { key: 'sprite.name', label: 'Name', description: 'The name of the sprite and of its file.', hint: 'The file takes the name when you save.', control: { kind: 'text', placeholder: 'Sprite name' } },
      {
        key: 'sprite.width',
        label: 'Width',
        description: 'Pixels across.',
        hint: 'Changing the size resizes every layer and frame, around the centre. One undo step undoes it.',
        control: { kind: 'number', min: 1, max: 2048, step: 1, unit: 'px' },
      },
      { key: 'sprite.height', label: 'Height', description: 'Pixels down.', hint: 'Changing the size resizes every layer and frame, around the centre.', control: { kind: 'number', min: 1, max: 2048, step: 1, unit: 'px' } },
    ],
  },
  {
    id: 'pivot',
    title: 'Pivot',
    items: [
      { key: 'sprite.pivotX', label: 'Pivot x', description: 'Where the sprite turns and is placed, across.', hint: 'Half pixels are allowed.', control: { kind: 'number', min: 0, step: 0.5, unit: 'px' } },
      { key: 'sprite.pivotY', label: 'Pivot y', description: 'Where the sprite turns and is placed, down.', hint: 'Half pixels are allowed.', control: { kind: 'number', min: 0, step: 0.5, unit: 'px' } },
    ],
  },
  {
    id: 'animation',
    title: 'Animation',
    items: [
      {
        key: 'sprite.frameMs',
        label: 'Frame time',
        description: 'How long every frame shows.',
        hint: 'Sets all frames of the sprite. The timeline sets one frame at a time.',
        control: { kind: 'number', min: 1, max: 65535, step: 10, unit: 'ms' },
      },
    ],
  },
  {
    id: 'grid',
    title: 'Grid',
    items: [
      {
        key: 'sprite.gridWidth',
        label: 'Pixel grid across',
        description: 'Pixels between grid lines across. 1 draws a line between every pixel.',
        hint: 'Saved with the sprite. A new sprite takes it from the defaults.',
        control: { kind: 'number', min: 1, max: 2048, step: 1, unit: 'px' },
      },
      {
        key: 'sprite.gridHeight',
        label: 'Pixel grid down',
        description: 'Pixels between grid lines down.',
        hint: 'Saved with the sprite.',
        control: { kind: 'number', min: 1, max: 2048, step: 1, unit: 'px' },
      },
      { key: 'view.grid', label: 'Pixel grid', description: 'Draw a line between pixels when zoomed in.', hint: 'This is a view setting. It does not change the file.' },
      { key: 'view.gridTile', label: 'Tile grid', description: 'Draw the boundaries of tiles of a set size.', hint: 'The tile size is set on the App Canvas page.' },
    ],
  },
  {
    id: 'export',
    title: 'Export',
    items: [
      {
        key: 'sprite.export',
        label: 'Export presets',
        description: 'Save the sprite as a PNG, a strip or an animation.',
        hint: 'The presets you save are kept in the sprite file.',
        actions: [{ id: 'export', label: 'Export...', icon: 'upload', onSelect: () => runInEditor(FILE_COMMAND.export) }],
      },
      {
        key: 'sprite.exportPresets',
        label: 'Saved presets',
        description: 'The sprite export settings you saved. Run opens the Export window with a preset in place.',
        hint: 'Save a preset in the Export window. It goes into this sprite file, or into the project file when it covers several sprites. Presets saved in the app are listed last.',
      },
    ],
  },
];

export default sections;
export { meta };
