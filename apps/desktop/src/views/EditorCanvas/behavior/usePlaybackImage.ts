/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { playFlip } from '../../../timeline/play-flip';
import { composedImage } from '../../../timeline/composed-image';

const usePlaybackImage = (): ImageData | null => {
  const focus = useAnimationFocus();
  const playing = useTimelineStore((state) => state.playing);
  const cursor = useTimelineStore((state) => state.cursor);
  return useMemo(() => (playing && focus ? composedImage(focus.artwork, focus.animation, focus.frame.id, playFlip(focus)) : null), [playing, focus, cursor]);
};

export { usePlaybackImage };
