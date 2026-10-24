/* @layer renderer-app @kind constants */
import type { AnimationFormat, ColourMode, ExportKind, FrameChoice, LayerChoice, LayoutChoice } from '../../export/export.type';

const EXPORT_DIALOG_TEXT = {
  title: 'Export',
  write: 'Write',
  sprites: 'Sprites',
  layers: 'Layers',
  frames: 'Frames',
  tag: 'Tag',
  noTags: 'This sprite has no tags',
  format: 'Animation format',
  layout: 'Layout',
  columns: 'Columns',
  padding: 'Padding in pixels',
  extrusion: 'Extrusion in pixels',
  trim: 'Trim transparent edges',
  flavour: 'JSON format',
  scale: 'Scale',
  scaleNote: 'Whole numbers 1 to 8. Never blurred.',
  colour: 'Colour',
  gifColour: 'A GIF always uses a palette.',
  approve: 'Approve the combined palette',
  folder: 'Save to',
  folderName: 'Folder to save to',
  browse: 'Browse...',
  fileName: 'File name',
  preview: 'Preview',
  noPreview: 'No preview',
  preset: 'Preset',
  presetName: 'Preset name',
  presetNone: 'Choose a preset',
  savePreset: 'Save preset...',
  saveNamed: 'Save',
  cancel: 'Cancel',
  browseTitle: 'Choose where to export',
  selected: (count: number): string => `Selected sprites (${count})`,
  all: (count: number): string => `All sprites (${count})`,
  current: 'Current sprite',
  revision: (revision: number): string => `Exports revision ${revision}. You can keep editing while it runs.`,
  running: 'Wait for the current export.',
} as const;

const KIND_OPTIONS: { value: ExportKind; label: string }[] = [
  { value: 'sprite', label: 'Sprite PNG' },
  { value: 'frames', label: 'Frames' },
  { value: 'animation', label: 'Animation' },
  { value: 'sheet', label: 'Sheet and JSON' },
];

const LAYER_OPTIONS: { value: LayerChoice; label: string }[] = [
  { value: 'visible', label: 'Visible layers' },
  { value: 'all', label: 'All layers' },
];

const FRAME_OPTIONS: { value: FrameChoice; label: string }[] = [
  { value: 'current', label: 'Current frame' },
  { value: 'tag', label: 'Tag' },
  { value: 'all', label: 'All frames' },
];

const FORMAT_OPTIONS: { value: AnimationFormat; label: string }[] = [
  { value: 'gif', label: 'GIF' },
  { value: 'apng', label: 'APNG' },
];

const LAYOUT_OPTIONS: { value: LayoutChoice; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'packed', label: 'Packed' },
];

const FLAVOUR_OPTIONS = [
  { value: 'bxel', label: 'Bxel' },
  { value: 'hash', label: 'Hash' },
] as const;

const COLOUR_OPTIONS: { value: ColourMode; label: string }[] = [
  { value: 'rgba', label: 'RGBA PNG' },
  { value: 'indexed', label: 'Indexed PNG' },
];

export {
  COLOUR_OPTIONS,
  EXPORT_DIALOG_TEXT,
  FLAVOUR_OPTIONS,
  FORMAT_OPTIONS,
  FRAME_OPTIONS,
  KIND_OPTIONS,
  LAYER_OPTIONS,
  LAYOUT_OPTIONS,
};
