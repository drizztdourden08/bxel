/* @layer renderer-app @kind constants */
import type { FileTypeChoice } from './FileTypePicker.type';

const FILE_TYPE_CHOICES: readonly FileTypeChoice[] = [
  { kind: 'sprite', label: 'Sprite' },
  { kind: 'animation', label: 'Animation' },
  { kind: 'sheet', label: 'Spritesheet' },
  { kind: 'palette', label: 'Palette' },
  { kind: 'tileset', label: 'Tileset' },
  { kind: 'tilemap', label: 'Tilemap' },
];

const FILE_TYPE_TEXT = {
  label: 'New file',
  title: 'New file',
  message: 'Pick the type of file to create.',
} as const;

export { FILE_TYPE_CHOICES, FILE_TYPE_TEXT };
