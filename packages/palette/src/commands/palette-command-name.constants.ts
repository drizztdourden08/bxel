/* @layer core @kind constants */

const PALETTE_COMMAND_NAME = {
  paletteCreate: 'palette.create',
  spriteImport: 'sprite.import',
  animationImport: 'animation.import',
  tilesetImport: 'tileset.import',
  swatchDelete: 'swatch.delete',
  swatchMerge: 'swatch.merge',
  rampAdd: 'ramp.add',
  rampUpdate: 'ramp.update',
  rampDelete: 'ramp.delete',
  paletteUpdate: 'palette.update',
  paletteDelete: 'palette.delete',
  paletteDetach: 'palette.detach',
  paletteDuplicate: 'palette.duplicate',
  paletteAssign: 'palette.assign',
  paletteImport: 'palette.import',
} as const;

export { PALETTE_COMMAND_NAME };
