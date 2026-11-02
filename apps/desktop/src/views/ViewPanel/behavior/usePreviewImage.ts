/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { composedImage } from '../../../timeline/composed-image';
import { playFlip } from '../../../timeline/play-flip';

const usePreviewImage = (): ImageData | null => {
  const focus = useAnimationFocus();
  const playing = useTimelineStore((state) => state.playing);
  const cursor = useTimelineStore((state) => state.cursor);
  return useMemo(() => (focus ? composedImage(focus.artwork, focus.animation, focus.frame.id, playing ? playFlip(focus) : null) : null), [focus, playing, cursor]);
};

export { usePreviewImage };
