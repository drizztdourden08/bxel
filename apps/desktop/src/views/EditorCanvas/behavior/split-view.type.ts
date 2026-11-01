/* @layer renderer-app @kind types */
import type { PixelPoint, PixelViewportProps } from '../../PixelViewport/PixelViewport.type';

type ViewControl = Pick<PixelViewportProps, 'zoom' | 'pan' | 'zoomLocked' | 'onZoomChange' | 'onPanChange'>;

interface SharedView {
  zoom: number;
  pan: PixelPoint;
}

interface SplitMode {
  split: boolean;
  link: boolean;
  actual: boolean;
}

interface SplitControls {
  first: ViewControl;
  second: ViewControl;
}

interface SplitFollow {
  shared: SharedView | null;
  onZoom: (zoom: number) => void;
  onPan: (pan: PixelPoint) => void;
}

export type { SharedView, SplitControls, SplitFollow, SplitMode, ViewControl };
