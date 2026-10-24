/* @layer core @kind types */
import type { TiledOrientation } from './tiled.type';

type MapShape = {
  readonly orientation: TiledOrientation;
  readonly width: number;
  readonly height: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
};

export type { MapShape };
