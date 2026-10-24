/* @layer renderer-app @kind constants */
import type { ExportKind } from './export.type';
import type { PresetOrigin } from './preset-entry.type';

const PRESET_KINDS: Readonly<Record<'sprite' | 'sheet', readonly ExportKind[]>> = {
  sprite: ['sprite', 'frames', 'animation'],
  sheet: ['sheet'],
};

const KIND_LABEL: Readonly<Record<ExportKind, string>> = {
  sprite: 'Sprite PNG',
  frames: 'Frame PNGs',
  animation: 'Animation',
  sheet: 'Sheet',
  map: 'Map',
};

const PRESET_TEXT = {
  empty: 'No presets are saved for this yet. Save one in the Export window.',
  nameEmpty: 'Type a name for the preset.',
  nameTaken: (name: string): string => `A preset named ${name} already exists.`,
  detail: (kind: ExportKind, scale: number): string => `${KIND_LABEL[kind]}, scale ${scale}`,
  saveLabel: 'Save export preset',
  renameLabel: 'Rename export preset',
  deleteLabel: 'Delete export preset',
  moveLabel: 'Move export presets into the project',
  inSprite: (name: string): string => `sprite ${name}`,
  inSheet: (name: string): string => `sheet ${name}`,
  inProject: 'the project',
  savedIn: (name: string, where: string): string => `Saved preset ${name} in ${where}.`,
  savedInApp: (name: string): string => `Saved preset ${name} as an app preset.`,
  saveFailed: (message: string): string => `The preset was not saved: ${message}`,
  groupAsset: 'This asset',
  groupProject: 'Project presets',
  groupApp: 'App presets',
  moveQuestion: (count: number): string => `Move ${count} saved export ${count === 1 ? 'preset' : 'presets'} into this project?`,
  move: 'Move',
  keep: 'Keep as app presets',
  moved: (count: number): string => `Moved ${count} export ${count === 1 ? 'preset' : 'presets'} into the project.`,
  noProject: 'There is no open project to move them into.',
  moveFailed: (message: string): string => `The presets were not moved: ${message}`,
} as const;

const PRESET_GROUPS: readonly { readonly origin: PresetOrigin; readonly label: string }[] = [
  { origin: 'asset', label: PRESET_TEXT.groupAsset },
  { origin: 'project', label: PRESET_TEXT.groupProject },
  { origin: 'app', label: PRESET_TEXT.groupApp },
];

export { KIND_LABEL, PRESET_GROUPS, PRESET_KINDS, PRESET_TEXT };
