/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { firstPixelLayer } from './first-pixel-layer';

const activateLayer = (id: string): void => {
  const target = currentTarget();
  const pixel = target ? firstPixelLayer(target.sprite.layers, id) : null;
  if (pixel !== null) useToolStore.getState().setLayer(pixel);
};

export { activateLayer };
