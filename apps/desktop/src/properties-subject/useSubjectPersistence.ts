/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import type { AppSettings } from '../settings.type';
import { useSubjectStore } from './useSubjectStore';

/** Keeps the pinned file across a restart. Only a pin with a file path is kept. */
const useSubjectPersistence = (): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const restored = useRef(false);
  const stored = settings.propertiesPin ?? null;

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    if (typeof stored === 'string' && stored !== '') useSubjectStore.getState().restore({ path: stored, key: null });
  }, [stored]);

  useEffect(
    () =>
      useSubjectStore.subscribe((state, before) => {
        if (state.pin === before.pin || !restored.current) return;
        const path = state.pin?.path ?? null;
        if (path !== stored) patch({ propertiesPin: path });
      }),
    [patch, stored],
  );
};

export { useSubjectPersistence };
