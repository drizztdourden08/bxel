/* @layer renderer-app @kind types */
import type { IconName, IconProps } from '@drizztdourden08/tessera';

type PaintIconName = 'brushSquare' | 'brushCircle' | 'pixelPerfect';

type ViewIconName = 'grid' | 'tiled' | 'rulers' | 'onionSkin' | 'mirrorX' | 'mirrorY';

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

type TilemapIconName =
  | 'tileset'
  | 'tileAdd'
  | 'tileUnique'
  | 'mapPaint'
  | 'mapErase'
  | 'mapFill'
  | 'mapRect'
  | 'mapPick'
  | 'mapLayerAdd'
  | 'flipTileX'
  | 'flipTileY';

type SpriteIconName = 'flipH' | 'flipV' | 'turnLeft' | 'turnRight' | 'pivot' | 'isolate';

type TimelineIconName = 'pause' | 'loop' | 'pingPong' | 'framePrev' | 'frameNext';

type FrameIconName = 'frameAdd' | 'frameDuplicate' | 'frameDelete' | 'tagAdd' | 'linkedCel' | 'unlinkCel';

type PixelIconName =
  | PaintIconName
  | ViewIconName
  | ActionIconName
  | SheetIconName
  | TilemapIconName
  | SpriteIconName
  | TimelineIconName
  | FrameIconName;

type StockPixelIconName = Extract<IconName, `pixel-${string}`>;

type AnyPixelIconName = PixelIconName | StockPixelIconName;

type PixelBitmap = readonly string[];

type PixelTone = 'solid' | 'soft';

type PixelIconData = NonNullable<IconProps['icon']>;

export type {
  ActionIconName,
  AnyPixelIconName,
  FrameIconName,
  PaintIconName,
  PixelBitmap,
  PixelIconData,
  PixelIconName,
  PixelTone,
  SheetIconName,
  SpriteIconName,
  StockPixelIconName,
  TilemapIconName,
  TimelineIconName,
  ViewIconName,
};
