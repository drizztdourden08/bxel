/* @layer renderer-app @kind logic */
import { SHEET_TEXT } from '../sheet/sheet.constants';
import type { SpriteHeader } from './stage-header.type';

const scopeText = (sprite: SpriteHeader, active: string): string => {
  if (sprite.layerScope === 'active') return SHEET_TEXT.activeLayerLabel(active);
  if (sprite.layerScope === 'visible') return SHEET_TEXT.visibleLayersLabel(sprite.layers.filter((layer) => layer.state !== 'hidden').length);
  return SHEET_TEXT.allLayers(sprite.layers.length);
};

const layerLabel = (sprite: SpriteHeader, active: string): string => SHEET_TEXT.layersChip(scopeText(sprite, active));

export { layerLabel };
