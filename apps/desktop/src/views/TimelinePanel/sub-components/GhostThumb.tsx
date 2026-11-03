/* @layer renderer-app @kind component */
import { PixelThumbnail } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { composedFrame } from '../../../timeline/composed-frame';
import type { GhostThumbProps } from './GhostThumb.type';

const GhostThumb = ({ focus, frameId }: GhostThumbProps) => {
  const { artwork, animation } = focus;
  const image = useMemo(() => composedFrame(artwork, animation, frameId), [artwork, animation, frameId]);
  return <PixelThumbnail image={image} box={32} />;
};

export { GhostThumb };
