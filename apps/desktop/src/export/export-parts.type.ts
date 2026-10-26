/* @layer renderer-app @kind types */
import type { ExportFrame, ExportSprite, TileAnimationEntry, TilesetImage } from '@bxel/formats';

type TileHeld = {
  readonly sheet: TilesetImage;
  readonly imageName: string;
  readonly animations: readonly TileAnimationEntry[];
};

type SheetDim = {
  readonly width: number;
  readonly height: number;
  readonly frames: number;
};

type Clip = {
  readonly name: string;
  readonly frames: readonly ExportFrame[];
  readonly repeat: number;
};

type AnimationSources = {
  readonly sprites: readonly ExportSprite[];
  readonly only: boolean;
  readonly title: string;
};

export type { AnimationSources, Clip, SheetDim, TileHeld };
