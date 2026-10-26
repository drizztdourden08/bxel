/* @layer renderer-app @kind types */
import type { Artwork, MapLayerId, Tilemap, TilePlayback } from '@bxel/document';

type PlannedCell = {
  readonly layer: MapLayerId;
  readonly index: number;
  readonly key: number;
  readonly playback: TilePlayback;
};

type TilePlan = {
  readonly artwork: Artwork;
  readonly tilemap: Tilemap;
  readonly cells: readonly PlannedCell[];
};

type MapPixels = Pick<ImageData, 'data' | 'width' | 'height'>;

type Animator = {
  readonly advance: (now: number) => boolean;
  readonly restore: () => void;
};

export type { Animator, MapPixels, PlannedCell, TilePlan };
