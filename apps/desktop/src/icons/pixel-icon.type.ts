/* @layer renderer-app @kind types */
import type { IconProps } from '@drizztdourden08/tessera';

type PaintIconName =
  | 'pencil'
  | 'eraser'
  | 'fill'
  | 'picker'
  | 'fillContiguous'
  | 'fillGlobal'
  | 'brushSquare'
  | 'brushCircle'
  | 'pixelPerfect';

type ShapeIconName =
  | 'line'
  | 'rectangle'
  | 'ellipse'
  | 'rectangleFilled'
  | 'ellipseFilled'
  | 'polygon'
  | 'curve';

type SelectIconName =
  | 'selectRectangle'
  | 'selectEllipse'
  | 'lasso'
  | 'selectPolygon'
  | 'magicWand'
  | 'selectColour'
  | 'move';

type ViewIconName =
  | 'zoom'
  | 'hand'
  | 'grid'
  | 'tiled'
  | 'rulers'
  | 'onionSkin'
  | 'mirrorX'
  | 'mirrorY';

type ActionIconName =
  | 'play'
  | 'undo'
  | 'redo'
  | 'saveFile'
  | 'exportImage'
  | 'layers'
  | 'palette';

type PixelIconName = PaintIconName | ShapeIconName | SelectIconName | ViewIconName | ActionIconName;

type PixelBitmap = readonly string[];

type PixelTone = 'solid' | 'soft';

type PixelIconData = NonNullable<IconProps['icon']>;

export type { PaintIconName, ShapeIconName, SelectIconName, ViewIconName, ActionIconName, PixelBitmap, PixelIconData, PixelIconName, PixelTone };
