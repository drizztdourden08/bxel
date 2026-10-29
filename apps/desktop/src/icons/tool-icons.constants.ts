/* @layer renderer-app @kind constants */
import type { SelectVariant } from '../editor/selection/selection.type';
import type { PixelIconName } from './pixel-icon.type';

const SELECT_VARIANT_ICONS: Readonly<Record<SelectVariant, PixelIconName>> = {
  rect: 'pixel-select-rect',
  ellipse: 'pixel-select-ellipse',
  lasso: 'pixel-select-lasso',
  polygon: 'pixel-select-polygon',
  wand: 'pixel-select-wand',
  colour: 'pixel-select-color',
};

export { SELECT_VARIANT_ICONS };
