/* @layer renderer-app @kind component */
import type { AnimFrameId, Animation, Artwork } from '@bxel/document';
import { PixelThumbnail } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { composedFrame } from '../../../timeline/composed-frame';

const TileThumb = ({ artwork, animation, frameId }: { artwork: Artwork; animation: Animation; frameId: AnimFrameId }) => {
  const image = useMemo(() => composedFrame(artwork, animation, frameId), [artwork, animation, frameId]);
  return <PixelThumbnail image={image} box={40} />;
};

export { TileThumb };
