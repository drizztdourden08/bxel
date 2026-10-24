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
  | 'palette'
  | 'lock';

type SheetIconName = 'gridView' | 'listView' | 'atlas';

type SpriteIconName = 'flipH' | 'flipV' | 'turnLeft' | 'turnRight' | 'pivot' | 'isolate';

type TimelineIconName = 'pause' | 'loop' | 'pingPong' | 'framePrev' | 'frameNext';

type FrameIconName = 'frameAdd' | 'frameDuplicate' | 'frameDelete' | 'tagAdd' | 'linkedCel' | 'unlinkCel';

type PixelIconName =
  | PaintIconName
  | ShapeIconName
  | SelectIconName
  | ViewIconName
  | ActionIconName
  | SheetIconName
  | SpriteIconName
  | TimelineIconName
  | FrameIconName;

type PixelBitmap = readonly string[];

type PixelTone = 'solid' | 'soft';

type PixelIconData = NonNullable<IconProps['icon']>;

export type {
  PaintIconName,
  ShapeIconName,
  SelectIconName,
  ViewIconName,
  ActionIconName,
  SheetIconName,
  SpriteIconName,
  TimelineIconName,
  FrameIconName,
  PixelBitmap,
  PixelIconData,
  PixelIconName,
  PixelTone,
};
