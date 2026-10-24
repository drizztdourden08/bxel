/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { PixelPoint } from '../../PixelViewport';
import type { SharedView } from '../ImagePreview.type';

const useSharedView = (): SharedView => {
  const [zoom, onZoomChange] = useState<number | undefined>(undefined);
  const [pan, onPanChange] = useState<PixelPoint | undefined>(undefined);
  return { zoom, pan, onZoomChange, onPanChange };
};

export { useSharedView };
