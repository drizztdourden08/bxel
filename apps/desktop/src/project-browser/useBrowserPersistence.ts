/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import type { AppSettings } from '../settings.type';
import { putBrowserView } from './put-browser-view';
import { readBrowserView } from './read-browser-view';
import { SAVE_DELAY_MS } from './project-browser.constants';
import type { SavedBrowserView } from './project-browser.type';
import { useBrowserStore } from './useBrowserStore';

const savedOf = (): SavedBrowserView => {
  const { view, size, sort, preview, folder, pinned, smart } = useBrowserStore.getState();
  return { view, size, sort, preview, folder, pinned, smart };
};

const useBrowserPersistence = (projectKey: string | null): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const held = useRef(settings.projectBrowserViews);
  held.current = settings.projectBrowserViews;
  const loaded = useRef<string | null>(null);

  useEffect(() => {
    if (projectKey === null || loaded.current === projectKey) return undefined;
    loaded.current = projectKey;
    useBrowserStore.getState().load(readBrowserView(held.current, projectKey));
    return undefined;
  }, [projectKey]);

  useEffect(() => {
    if (projectKey === null) return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = useBrowserStore.subscribe((state, before) => {
      if (loaded.current !== projectKey) return;
      const changed = state.view !== before.view || state.size !== before.size || state.sort !== before.sort || state.preview !== before.preview || state.folder !== before.folder || state.pinned !== before.pinned || state.smart !== before.smart;
      if (!changed) return;
      clearTimeout(timer);
      timer = setTimeout(() => patch({ projectBrowserViews: putBrowserView(held.current, projectKey, savedOf()) }), SAVE_DELAY_MS);
    });
    return () => {
      stop();
      clearTimeout(timer);
    };
  }, [projectKey, patch]);
};

export { useBrowserPersistence };
