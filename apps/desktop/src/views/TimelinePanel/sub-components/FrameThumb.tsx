/* @layer renderer-app @kind component */
import { PixelThumbnail } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { thumbBox } from '../../../pixel-thumb/thumb-box';
import { composedFrame } from '../../../timeline/composed-frame';
import type { FrameThumbProps } from '../TimelinePanel.type';

const FrameThumb = ({ focus, cell, thumb }: FrameThumbProps) => {
  const { artwork, animation } = focus;
  const image = useMemo(() => composedFrame(artwork, animation, cell.id), [artwork, animation, cell.id]);
  return <PixelThumbnail image={image} box={thumbBox(thumb)} />;
};

export { FrameThumb };
