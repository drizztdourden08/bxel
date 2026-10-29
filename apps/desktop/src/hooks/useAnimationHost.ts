/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import type { AppSettings } from '../settings.type';
import { useTimelineStore } from '../stores/useTimelineStore';
import { readOnion } from '../timeline/read-onion';
import { readPlay } from '../timeline/read-play';
import { writeAnimationSettings } from '../timeline/write-animation-settings';

const useAnimationHost = (): void => {
  const { settings, patch, hydrated } = useSettings<AppSettings>();
  const patcher = useRef(patch);
  const pending = useRef<string[]>([]);
  useEffect(() => {
    patcher.current = patch;
  }, [patch]);

  useEffect(() => {
    if (!hydrated) return;
    const next = { onion: readOnion(settings), ...readPlay(settings) };
    const json = JSON.stringify(writeAnimationSettings(next));
    const waiting = pending.current.indexOf(json);
    if (waiting >= 0) {
      pending.current.splice(waiting, 1);
      return;
    }
    if (json !== JSON.stringify(writeAnimationSettings(useTimelineStore.getState()))) useTimelineStore.setState(next);
  }, [hydrated, settings]);

  useEffect(() => {
    if (!hydrated) return undefined;
    return useTimelineStore.subscribe((state, previous) => {
      const next = JSON.stringify(writeAnimationSettings(state));
      if (next === JSON.stringify(writeAnimationSettings(previous))) return;
      pending.current.push(next);
      patcher.current(JSON.parse(next) as Partial<AppSettings>);
    });
  }, [hydrated]);
};

export { useAnimationHost };
