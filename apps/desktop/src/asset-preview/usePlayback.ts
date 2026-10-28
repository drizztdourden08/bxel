/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { frameDelay } from './frame-delay';
import { playOrder } from './play-order';
import type { PlaybackInput, PlaybackModel, PlaybackSpeed } from './asset-preview.type';

const usePlayback = ({ frames, loop }: PlaybackInput): PlaybackModel => {
  const order = useMemo(() => playOrder(frames.length, loop.direction), [frames.length, loop.direction]);
  const [at, setAt] = useState(0);
  const [passes, setPasses] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>('1');
  const finished = loop.repeat > 0 && passes >= loop.repeat;
  const index = order[Math.min(at, Math.max(0, order.length - 1))] ?? 0;

  useEffect(() => {
    if (!playing || order.length < 2 || finished) return undefined;
    const shown = frames[index];
    const timer = setTimeout(() => {
      if (document.hidden) {
        setPlaying(false);
        return;
      }
      if (at + 1 >= order.length) {
        setPasses((count) => count + 1);
        setAt(0);
      } else setAt(at + 1);
    }, frameDelay(shown?.durationMs ?? 100, speed));
    return () => clearTimeout(timer);
  }, [playing, order, finished, frames, index, at, speed]);

  useEffect(() => {
    if (finished) setPlaying(false);
  }, [finished]);

  const play = useCallback(() => {
    setPasses(0);
    if (finished) setAt(0);
    setPlaying(true);
  }, [finished]);
  const pause = useCallback(() => setPlaying(false), []);
  const step = useCallback(
    (by: number) => {
      setPlaying(false);
      setAt((value) => (order.length === 0 ? 0 : (value + by + order.length) % order.length));
    },
    [order.length],
  );

  return { index, shown: Math.min(index + 1, frames.length), playing, speed, finished, play, pause, step, setSpeed };
};

export { usePlayback };
