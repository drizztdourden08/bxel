/* @layer renderer-app @kind types */
import type { RgbaImage } from '@bxel/formats';
import type { OverviewPreview, PreviewCell, PreviewColour, PreviewFrame, PreviewTag } from '../../asset-overview/asset-overview.type';
import type { PlaybackLoop, PlaybackModel, PreviewMode } from '../../asset-preview/asset-preview.type';

type AssetPreviewProps = {
  readonly preview: OverviewPreview;
  readonly name: string;
  readonly loop?: PlaybackLoop;
  readonly mode?: PreviewMode;
  readonly tags?: readonly PreviewTag[];
};

type PixelStageProps = {
  readonly image: RgbaImage;
  readonly label: string;
  readonly mode: PreviewMode;
  readonly cells?: readonly PreviewCell[] | undefined;
};

type CellOutlineProps = { readonly cell: PreviewCell | null; readonly zoom: number };

type FramesPreviewProps = {
  readonly frames: readonly PreviewFrame[];
  readonly name: string;
  readonly loop: PlaybackLoop;
  readonly mode: PreviewMode;
  readonly tags: readonly PreviewTag[];
};

type TagPickerProps = {
  readonly tags: readonly PreviewTag[];
  readonly tagId: string | null;
  readonly onTag: (id: string | null) => void;
};

type FramesPlayerProps = FramesPreviewProps & Omit<TagPickerProps, 'tags'>;

type PlaybackBarProps = {
  readonly playback: PlaybackModel;
  readonly total: number;
  readonly loop: PlaybackLoop;
} & TagPickerProps;

type SwatchGridProps = {
  readonly colours: readonly PreviewColour[];
  readonly name: string;
  readonly mode: PreviewMode;
};

type StageSize = { readonly width: number; readonly height: number };

export type { AssetPreviewProps, CellOutlineProps, FramesPlayerProps, FramesPreviewProps, PixelStageProps, PlaybackBarProps, StageSize, SwatchGridProps, TagPickerProps };
