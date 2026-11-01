/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from './useBrowserContext';

type Scrollable = { readonly scrollToIndex: (index: number) => void };

const useScrollToSelected = (handle: RefObject<Scrollable | null>): void => {
  const { model } = useBrowserContext();
  const anchor = useBrowserStore((state) => state.selection.anchor);
  useEffect(() => {
    const at = model.entries.findIndex((entry) => entry.id === anchor);
    if (at >= 0) handle.current?.scrollToIndex(at);
  }, [anchor, handle, model.entries]);
};

export { useScrollToSelected };
