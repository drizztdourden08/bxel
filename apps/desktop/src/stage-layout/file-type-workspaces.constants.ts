/* @layer renderer-app @kind constants */
import { defineWorkspace } from '@drizztdourden08/brock-react';
import type { ShowRule } from '@drizztdourden08/brock-react';
import type { FileType } from '../ui-context/bxel-context.type';
import { CONTEXT_FLAGS } from '../ui-context/context-flags.constants';
import { SHEET_WORKSPACE } from './sheet-workspace.constants';

const onFileType = (type: FileType): ShowRule => ({ when: (context) => context.flags[CONTEXT_FLAGS.fileType] === type });

const SPRITE_WORKSPACE = defineWorkspace({
  id: 'sprite',
  label: 'Sprite',
  icon: 'pencil',
  order: 0,
  when: onFileType('sprite'),
  layout: { rows: [['main', 'palette']], widths: [[0.8, 0.2]] },
});

const ANIMATION_WORKSPACE = defineWorkspace({
  id: 'animation',
  label: 'Animation',
  icon: 'film',
  order: 2,
  when: onFileType('animation'),
  layout: { rows: [['main', 'palette'], ['timeline']], widths: [[0.8, 0.2], [1]], sizes: [0.66, 0.34] },
});

const PALETTE_WORKSPACE = defineWorkspace({
  id: 'palette',
  label: 'Palette',
  icon: 'palette',
  order: 3,
  when: onFileType('palette'),
  layout: { rows: [['main']] },
});

const TILESET_WORKSPACE = defineWorkspace({
  id: 'tileset',
  label: 'Tileset',
  icon: 'grid-3x3',
  order: 4,
  when: onFileType('tileset'),
  layout: { rows: [['main', 'palette'], ['tileset']], widths: [[0.8, 0.2], [1]], sizes: [0.62, 0.38] },
});

const TILEMAP_WORKSPACE = defineWorkspace({
  id: 'tilemap',
  label: 'Tilemap',
  icon: 'map',
  order: 5,
  when: onFileType('tilemap'),
  layout: { rows: [['main', { column: ['tileset', 'layers'] }]], widths: [[0.72, 0.28]] },
});

const IMAGE_WORKSPACE = defineWorkspace({
  id: 'image',
  label: 'Image',
  icon: 'image',
  order: 6,
  when: onFileType('image'),
  layout: { rows: [['main']] },
});

const FILE_TYPE_WORKSPACES = [SPRITE_WORKSPACE, SHEET_WORKSPACE, ANIMATION_WORKSPACE, PALETTE_WORKSPACE, TILESET_WORKSPACE, TILEMAP_WORKSPACE, IMAGE_WORKSPACE] as const;

export { FILE_TYPE_WORKSPACES };
