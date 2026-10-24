/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useCanvasLook } from '../../canvas-look/useCanvasLook';
import { PixelViewport } from '../PixelViewport';
import type { ImagePreviewProps } from './ImagePreview.type';
import './ImagePreview.css';

const ImagePreview = ({ image, label, view }: ImagePreviewProps) => {
  const look = useCanvasLook();
  const source = useMemo(() => new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), [image]);
  return (
    <PixelViewport
      className="image-preview"
      label={label}
      width={image.width}
      height={image.height}
      source={source}
      look={look}
      zoom={view.zoom}
      pan={view.pan}
      onZoomChange={view.onZoomChange}
      onPanChange={view.onPanChange}
      hand
    />
  );
};

export { ImagePreview };
