/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelPoint } from '../../PixelViewport/PixelViewport.type';
import { splitControls } from './split-controls';
import type { SharedView, SplitControls } from './split-view.type';
import type { ViewportRef } from './useSplitTools.type';

const sharedOf = (viewport: ViewportRef): SharedView | null => {
  const view = viewport.current?.view();
  return view ? { zoom: view.zoom, pan: { x: view.pan.x, y: view.pan.y } } : null;
};

const useSplitView = (first: ViewportRef, second: ViewportRef): SplitControls => {
  const mode = useViewStore(useShallow((state) => ({ split: state.split, link: state.splitLink, actual: state.splitActual })));
  const [shared, setShared] = useState<SharedView | null>(null);
  const latest = useRef<SharedView | null>(null);
  const linked = mode.split && mode.link;
  const share = useCallback((next: SharedView | null) => {
    latest.current = next;
    setShared(next);
  }, []);
  const patch = (part: Partial<SharedView>) => {
    const base = latest.current ?? sharedOf(first);
    if (base) share({ ...base, ...part });
  };
  useEffect(() => {
    if (!linked) return undefined;
    share(sharedOf(first));
    return () => {
      const last = latest.current;
      share(null);
      if (!last) return;
      [first.current, second.current].forEach((handle) => {
        handle?.setZoom(last.zoom);
        handle?.panTo(last.pan);
      });
    };
  }, [linked, first, second, share]);
  return splitControls(mode, {
    shared: linked ? shared : null,
    onZoom: (zoom: number) => patch({ zoom }),
    onPan: (pan: PixelPoint) => patch({ pan }),
  });
};

export { useSplitView };
