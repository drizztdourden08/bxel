/* @layer core @kind config */
const COMMAND_NAME = {
  projectUpdate: 'project.update',
  spriteCreate: 'sprite.create',
  spriteUpdate: 'sprite.update',
  pixelsPatch: 'pixels.patch',
  layerAdd: 'layer.add',
  layerDelete: 'layer.delete',
  layerUpdate: 'layer.update',
  layerReorder: 'layer.reorder',
  layerDuplicate: 'layer.duplicate',
  layerMerge: 'layer.merge',
  layerFlatten: 'layer.flatten',
  swatchAdd: 'swatch.add',
  swatchUpdate: 'swatch.update',
  paletteReorder: 'palette.reorder',
  paletteResize: 'palette.resize',
  pixelsPaint: 'pixels.paint',
  pixelsErase: 'pixels.erase',
  pixelsFill: 'pixels.fill',
  pixelsShape: 'pixels.shape',
} as const;

export { COMMAND_NAME };
