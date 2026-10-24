/* @layer renderer-app @kind constants */
import type { SpriteId } from '@bxel/document';
import type { JobStepDef } from '@drizztdourden08/brock-core';
import type { ExportKind, ExportResult, ExportSettings, IndexedStatus, SavedPreset, SpriteChoice } from './export.type';

const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  kind: 'sprite',
  sprites: 'current',
  layers: 'visible',
  frames: 'current',
  tag: '',
  scale: 1,
  colour: 'rgba',
  approved: false,
  animation: 'gif',
  layout: 'grid',
  columns: 4,
  padding: 1,
  extrusion: 0,
  margin: 0,
  maxWidth: 0,
  trim: false,
  powerOfTwo: false,
  rotate: false,
  pageSide: 0,
  sheetId: '',
  flavour: 'bxel',
  mapFormat: 'bxel',
  folder: '',
  fileName: '',
  pathTemplate: '',
};

const EXPORT_LIMITS = {
  minScale: 1,
  maxScale: 8,
  maxSide: 16384,
  maxPixels: 67108864,
  maxGifSide: 4096,
  maxColumns: 64,
  maxPadding: 64,
  maxExtrusion: 16,
  maxMargin: 64,
  maxColours: 256,
  minPackedWidth: 64,
} as const;

const EXPORT_RANGES = {
  scale: { min: EXPORT_LIMITS.minScale, max: EXPORT_LIMITS.maxScale },
  columns: { min: 1, max: EXPORT_LIMITS.maxColumns },
  padding: { min: 0, max: EXPORT_LIMITS.maxPadding },
  extrusion: { min: 0, max: EXPORT_LIMITS.maxExtrusion },
  margin: { min: 0, max: EXPORT_LIMITS.maxMargin },
  maxWidth: { min: 0, max: EXPORT_LIMITS.maxSide },
  pageSide: { min: 0, max: EXPORT_LIMITS.maxSide },
} as const;

const TRANSPARENT_RGBA: readonly number[] = [0, 0, 0, 0];

const EXPORT_JOB_ID = 'export';

const EXPORT_STEPS: readonly JobStepDef[] = [
  { id: 'render', label: 'Preparing images', weight: 3 },
  { id: 'write', label: 'Writing files', weight: 1 },
];

const UNSAFE_NAME_CHARS = /[\\/:*?"<>|\p{Cc}]/gu;

const IMAGE_EXTENSION = /\.(png|gif|apng|json|tmj)$/i;

const EXPORT_FALLBACK_NAME = 'export';

const EXPORT_TEXT = {
  noSprite: 'This file has no sprite to export.',
  noSheetSprites: 'The sheet has no sprites to export.',
  noSelection: 'No sprites are selected. Choose the current sprite or all sprites.',
  chooseTag: 'Choose a tag to export its frames.',
  noFolder: 'Choose a folder to save to.',
  unknownReason: 'The cause is unknown',
  needApproval: 'Approve the combined palette to export an indexed PNG.',
  noFiles: 'There is nothing to export with these settings.',
  noTag: (sprite: string, tag: string): string => `Sprite ${sprite} has no tag named ${tag}. Choose another tag or all frames.`,
  noFrames: (sprite: string): string => `Sprite ${sprite} has no frames to export.`,
  clash: (name: string): string => `Two files would be named ${name}. Rename a sprite or change the file name.`,
  tooLarge: (width: number, height: number): string =>
    `The output would be ${width} x ${height} px. The limit is ${EXPORT_LIMITS.maxSide} px on each side.`,
  gifTooLarge: (width: number, height: number): string =>
    `A GIF can be ${EXPORT_LIMITS.maxGifSide} px on each side. This one would be ${width} x ${height} px. Lower the scale or use APNG.`,
  indexedShared: (bank: string, opaque: number): string =>
    `Indexed PNG is available: the sprites share ${bank}, ${opaque} opaque colours plus transparent.`,
  indexedCombined: (banks: number, colours: number): string =>
    `Indexed PNG needs one combined palette: ${colours} colours from ${banks} palettes. Approve the combined mapping to use it.`,
  indexedOff: (banks: number, colours: number): string =>
    `Indexed PNG is off: the selected sprites use ${banks} palettes with ${colours} colours together. The limit is ${EXPORT_LIMITS.maxColours}. Export RGBA PNG or choose sprites that share one palette.`,
  indexedNoRoom: 'Indexed PNG is off: the palette has no room for a transparent colour. Export RGBA PNG.',
  indexedPerSprite: 'Each animation keeps the palette of its sprite.',
  gifRounding: (changed: number, total: number): string =>
    changed === 0
      ? 'GIF stores time in hundredths of a second. No frame time changes.'
      : `GIF stores time in hundredths of a second. ${changed} of ${total} frame times are rounded to the nearest 0.01 s.`,
  gifColours: (largest: number): string =>
    `GIF palette: ${largest} of ${EXPORT_LIMITS.maxColours} colours. Pixels are fully opaque or fully transparent, so no partial alpha is lost.`,
  apngNote: 'APNG keeps every colour and alpha value. Some viewers show only the first frame.',
  loops: (tag: string, repeat: number): string =>
    repeat === 0 ? `Tag ${tag} loops forever.` : `Tag ${tag} plays ${repeat} times.`,
  imageDetail: (name: string, width: number, height: number): string => `${name}, ${width} x ${height} px`,
  animationDetail: (name: string, width: number, height: number, frames: number): string =>
    `${name}, ${width} x ${height} px, ${frames} frames`,
  jsonDetail: (name: string, sprites: number): string =>
    `${name}, ${sprites} ${sprites === 1 ? 'sprite' : 'sprites'} with names, rectangles, pivots`,
  button: (count: number): string => `Export ${count} ${count === 1 ? 'file' : 'files'}`,
  exported: (count: number, folder: string): string =>
    `Exported ${count} ${count === 1 ? 'file' : 'files'} to ${folder}.`,
  failed: (reason: string): string => `Export failed: ${reason}. No files were changed.`,
  failedPartly: (reason: string, written: number): string =>
    `Export failed: ${reason}. ${written} ${written === 1 ? 'file was' : 'files were'} written before it stopped.`,
  jobTitle: (name: string): string => `Exporting ${name}`,
  jobLine: (name: string, done: number, total: number): string =>
    `Exporting ${name}: ${done} of ${total} ${total === 1 ? 'sprite' : 'sprites'}`,
  previewOpen: 'Apply or cancel the preview first.',
  unavailable: 'File access is not available here.',
  busy: 'Wait for the current export.',
} as const;

const ANIMATION_INDEXED: IndexedStatus = {
  state: 'available',
  needsApproval: false,
  note: EXPORT_TEXT.indexedPerSprite,
  map: null,
};

const EXPORT_CANCELLED: ExportResult = { kind: 'cancelled' };

const TRAILING_SEPARATORS = /[\\/]+$/u;

const FOLDER_TAIL = /[\\/][^\\/]*$/u;

const DATA_URL_CHUNK = 8192;

const PREVIEW_MIME: Readonly<Record<string, string>> = { png: 'image/png', gif: 'image/gif' };

const NO_SPRITES: readonly SpriteId[] = [];

const FOLDER_KINDS: readonly ExportKind[] = ['frames', 'sheet', 'map'];

const NO_PRESETS: readonly SavedPreset[] = [];

const EMPTY_PICK: Readonly<Record<SpriteChoice, string>> = {
  current: EXPORT_TEXT.noSprite,
  all: EXPORT_TEXT.noSprite,
  selected: EXPORT_TEXT.noSelection,
  sheet: EXPORT_TEXT.noSheetSprites,
};

const NO_INDEXED: IndexedStatus = { state: 'unavailable', note: '' };

export {
  ANIMATION_INDEXED,
  DATA_URL_CHUNK,
  EMPTY_PICK,
  DEFAULT_EXPORT_SETTINGS,
  EXPORT_CANCELLED,
  EXPORT_FALLBACK_NAME,
  EXPORT_JOB_ID,
  EXPORT_LIMITS,
  EXPORT_RANGES,
  EXPORT_STEPS,
  EXPORT_TEXT,
  FOLDER_KINDS,
  FOLDER_TAIL,
  IMAGE_EXTENSION,
  NO_INDEXED,
  NO_PRESETS,
  NO_SPRITES,
  PREVIEW_MIME,
  TRAILING_SEPARATORS,
  TRANSPARENT_RGBA,
  UNSAFE_NAME_CHARS,
};
