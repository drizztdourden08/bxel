/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import type { AppSettings } from '../settings.type';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { readOnion, readPlay, readThumbs, readView } from '../timeline/read-animation-settings';
import { writeAnimationSettings } from '../timeline/write-animation-settings';

const activeAnimation = (): string | null => {
  const { tabs, activeTab } = useWorkspaceStore.getState();
  const key = tabs.find((tab) => tab.id === activeTab)?.key;
  return key?.kind === 'animation' ? key.id : null;
};

const useAnimationHost = (): void => {
  const { settings, patch, hydrated } = useSettings<AppSettings>();
  const latest = useRef(settings);
  const patcher = useRef(patch);
  const pending = useRef<string[]>([]);
  useEffect(() => {
    latest.current = settings;
    patcher.current = patch;
  }, [settings, patch]);

  useEffect(() => {
    if (!hydrated) return;
    const view = readView(settings);
    const next = { onion: readOnion(settings), ...readPlay(settings), timeMode: view.timeMode, units: view.units };
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

  useEffect(() => {
    if (!hydrated) return undefined;
    const apply = (): void => {
      const id = activeAnimation();
      const stored = latest.current;
      const zoom = (id === null ? undefined : readThumbs(stored)[id]) ?? readView(stored).zoom;
      if (useTimelineStore.getState().zoom !== zoom) useTimelineStore.setState({ zoom, fit: false });
    };
    apply();
    const stopTabs = useWorkspaceStore.subscribe((state, previous) => {
      if (state.activeTab !== previous.activeTab) apply();
    });
    const stopZoom = useTimelineStore.subscribe((state, previous) => {
      const id = activeAnimation();
      if (id === null || state.zoom === previous.zoom || state.fit) return;
      patcher.current({ animThumbs: { ...readThumbs(latest.current), [id]: state.zoom } });
    });
    return () => {
      stopTabs();
      stopZoom();
    };
  }, [hydrated]);
};

export { useAnimationHost };
