/* @layer renderer-app @kind component */
import { PixelPlayer } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { rgbaOf } from '../../../asset-preview/rgba-of';
import type { ImagePreviewProps } from '../AssetPreview.type';

const ImagePreview = ({ image, label, cells }: ImagePreviewProps) => {
  const frames = useMemo(() => [{ image: rgbaOf(image), durationMs: 0 }], [image]);
  const outlines = useMemo(() => cells?.map((cell, index) => ({ id: String(index), ...cell })), [cells]);
  return <PixelPlayer className="asset-preview__player" label={label} frames={frames} {...(outlines === undefined ? {} : { cells: outlines })} />;
};

export { ImagePreview };
