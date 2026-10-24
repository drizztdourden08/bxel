/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useTimelineStore } from '../stores/useTimelineStore';
import { advancePlayback } from '../timeline/advance-playback';
import { frameDelay } from '../timeline/frame-delay';

const useTimelinePlayback = (): void => {
  const playing = useTimelineStore((state) => state.playing);
  useEffect(() => {
    if (!playing) return undefined;
    let timer = 0;
    const schedule = (): void => {
      timer = window.setTimeout(() => {
        if (advancePlayback()) schedule();
      }, frameDelay());
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [playing]);
  useEffect(() => () => useTimelineStore.getState().pause(), []);
};

export { useTimelinePlayback };
