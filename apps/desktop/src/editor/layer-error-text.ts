/* @layer renderer-app @kind logic */
import type { CommandError, Sprite } from '@bxel/document';
import { LAYER_ERROR_TEXT } from './layer-error-text.constants';

const layerErrorText = (error: CommandError, sprite: Sprite): string => {
  const named = sprite.layers.find((layer) => layer.id === error.details[0]?.layerId)?.name ?? '';
  return LAYER_ERROR_TEXT[error.code]?.(named) ?? error.message;
};

export { layerErrorText };
