/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { PixelViewport } from '../PixelViewport';
import type { ImagePreviewProps } from './ImagePreview.type';
import './ImagePreview.css';

const ImagePreview = ({ image, label, view }: ImagePreviewProps) => {
  const source = useMemo(() => new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), [image]);
  return (
    <PixelViewport
      className="image-preview"
      label={label}
      width={image.width}
      height={image.height}
      source={source}
      zoom={view.zoom}
      pan={view.pan}
      onZoomChange={view.onZoomChange}
      onPanChange={view.onPanChange}
      hand
    />
  );
};

export { ImagePreview };
