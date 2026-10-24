/* @layer renderer-app @kind constants */
import type { ExportKind } from './export.type';

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
} as const;

export { PRESET_KINDS, PRESET_TEXT };
