/* @layer renderer-app @kind constants */
const SHEET_GAP = 8;

const VIRTUAL_SPACING = { x: 2, y: 2 } as const;

const VIRTUAL_MIN_WIDTH = 64;

const SHEET_REF = 'sheet';

const SHEET_NAME = 'Sheet';

const SLICE_NAME = 'Slice';

const CHANNELS = 4;

const OFF_SHEET_ALPHA = 0.5;

const SHEET_TEXT = {
  sprite: 'Sprite',
  sheet: 'Sheet',
  tilemap: 'Tilemap',
  back: 'Back to sheet',
  paintAll: 'Paint all selected',
  painting: (count: number): string => `Painting ${count} sprites`,
  spriteChip: (name: string): string => `Sprite: ${name}`,
  spritesChip: (count: number): string => `Sprites: ${count} selected`,
  layerChip: (name: string): string => `Layer: ${name}`,
  layersChip: (label: string): string => `Layers: ${label}`,
  frameChip: (at: number, total: number): string => `Frame: ${at} of ${total}`,
  framesChip: (label: string): string => `Frames: ${label}`,
  currentSprite: 'Current sprite',
  selectedSprites: 'Selected sprites',
  activeLayer: 'Active layer',
  visibleLayers: 'Visible layers',
  allLayersItem: 'All layers',
  allLayers: (count: number): string => `All (${count})`,
  visibleLayersLabel: (count: number): string => `Visible (${count})`,
  activeLayerLabel: (name: string): string => name,
  currentFrame: (at: number, total: number): string => `Current (${at} of ${total})`,
  allFrames: (total: number): string => `All (${total})`,
  currentFrameItem: 'Current frame',
  allFramesItem: 'All frames',
  scopeLabel: 'Edit scope',
  noFile: 'Open a file first.',
  pickBusy: 'Finish the preview first.',
  paintNeedsTwo: 'Select two or more sprites first.',
} as const;

const MISMATCH_TEXT = {
  region: 'Mismatch',
  layers: (bad: number, total: number, layer: string): string =>
    `${bad} of ${total} selected sprites do not have layer ${layer}.`,
  others: (bad: number, total: number, why: string): string => `${bad} of ${total} selected sprites cannot take this edit: ${why}.`,
  sizes: 'their sizes differ',
  palettes: 'their palettes differ',
  both: 'their sizes or palettes differ',
  addLayer: (count: number): string => (count === 1 ? 'Add layer to 1 sprite' : `Add layer to ${count} sprites`),
  narrow: (count: number): string => `Narrow selection to ${count}`,
  paintBlocked: 'Fix the selection first. Some selected sprites cannot take the stroke.',
} as const;

export {
  MISMATCH_TEXT,
  CHANNELS, OFF_SHEET_ALPHA, SHEET_GAP, SHEET_NAME, SHEET_REF, SHEET_TEXT, SLICE_NAME, VIRTUAL_MIN_WIDTH,
  VIRTUAL_SPACING,
};
