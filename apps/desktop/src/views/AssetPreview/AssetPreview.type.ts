/* @layer renderer-app @kind types */
import type { RgbaImage } from '@bxel/formats';
import type { OverviewPreview, PreviewCell, PreviewColour, PreviewFrame, PreviewTag } from '../../asset-overview/asset-overview.type';
import type { PlaybackLoop, PreviewMode } from '../../asset-preview/asset-preview.type';

type AssetPreviewProps = {
  readonly preview: OverviewPreview;
  readonly name: string;
  readonly loop?: PlaybackLoop;
  readonly mode?: PreviewMode;
  readonly tags?: readonly PreviewTag[];
};

type ImagePreviewProps = {
  readonly image: RgbaImage;
  readonly label: string;
  readonly cells?: readonly PreviewCell[] | undefined;
};

type FramesPreviewProps = {
  readonly frames: readonly PreviewFrame[];
  readonly name: string;
  readonly loop: PlaybackLoop;
  readonly tags: readonly PreviewTag[];
};

type SwatchGridProps = {
  readonly colours: readonly PreviewColour[];
  readonly name: string;
  readonly mode: PreviewMode;
};

export type { AssetPreviewProps, FramesPreviewProps, ImagePreviewProps, SwatchGridProps };
