/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useTimelineStore } from '../stores/useTimelineStore';
import { resetClock } from '../timeline/reset-clock';
import { tickClock } from '../timeline/tick-clock';

const useTimelinePlayback = (): void => {
  const playing = useTimelineStore((state) => state.playing);
  useEffect(() => {
    if (!playing) return undefined;
    resetClock();
    let frame = 0;
    const loop = (now: number): void => {
      if (tickClock(now)) frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [playing]);
  useEffect(() => () => useTimelineStore.getState().pause(), []);
};

export { useTimelinePlayback };
