/* @layer renderer-app @kind types */
import type { RgbaImage } from '@bxel/formats';
import type { OverviewPreview, PreviewColour, PreviewFrame } from '../../asset-overview/asset-overview.type';
import type { PlaybackLoop, PlaybackModel, PreviewMode } from '../../asset-preview/asset-preview.type';

type AssetPreviewProps = {
  readonly preview: OverviewPreview;
  readonly name: string;
  readonly loop?: PlaybackLoop;
  readonly mode?: PreviewMode;
};

type PixelStageProps = {
  readonly image: RgbaImage;
  readonly label: string;
  readonly mode: PreviewMode;
};

type FramesPreviewProps = {
  readonly frames: readonly PreviewFrame[];
  readonly name: string;
  readonly loop: PlaybackLoop;
  readonly mode: PreviewMode;
};

type PlaybackBarProps = {
  readonly playback: PlaybackModel;
  readonly total: number;
  readonly loop: PlaybackLoop;
};

type SwatchGridProps = {
  readonly colours: readonly PreviewColour[];
  readonly name: string;
  readonly mode: PreviewMode;
};

type StageSize = { readonly width: number; readonly height: number };

export type { AssetPreviewProps, FramesPreviewProps, PixelStageProps, PlaybackBarProps, StageSize, SwatchGridProps };
