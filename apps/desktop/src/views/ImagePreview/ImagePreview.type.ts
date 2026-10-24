/* @layer renderer-app @kind types */
import type { PixelPoint } from '../PixelViewport';

interface PreviewImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

interface SharedView {
  zoom: number | undefined;
  pan: PixelPoint | undefined;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: PixelPoint) => void;
}

interface ImagePreviewProps {
  image: PreviewImage;
  label: string;
  view: SharedView;
}

export type { ImagePreviewProps, SharedView };
