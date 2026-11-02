/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { usePreviewStore } from '../../../stores/usePreviewStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { playFlip } from '../../../timeline/play-flip';
import { composedImage } from '../../../timeline/composed-image';

const usePlaybackImage = (): ImageData | null => {
  const focus = useAnimationFocus();
  const playing = useTimelineStore((state) => state.playing);
  const cursor = useTimelineStore((state) => state.cursor);
  const onCanvas = usePreviewStore((state) => state.onCanvas || !state.shown);
  return useMemo(() => (playing && onCanvas && focus ? composedImage(focus.artwork, focus.animation, focus.frame.id, playFlip(focus)) : null), [playing, onCanvas, focus, cursor]);
};

export { usePlaybackImage };
