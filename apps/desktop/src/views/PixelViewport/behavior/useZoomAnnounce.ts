/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ANNOUNCE_DELAY_MS, PIXEL_VIEWPORT_STRINGS } from '../PixelViewport.constants';
import { documentOf } from './document-of';
import { windowOf } from './window-of';

const useZoomAnnounce = (rootRef: RefObject<HTMLElement | null>, zoom: number): string => {
  const [said, setSaid] = useState('');
  const heard = useRef<number | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    const before = heard.current;
    heard.current = zoom;
    if (!root || before === null || before === zoom) return undefined;
    if (!root.contains(documentOf(root).activeElement)) return undefined;
    const view = windowOf(root);
    const timer = view.setTimeout(() => setSaid(PIXEL_VIEWPORT_STRINGS.zoomLevel(zoom)), ANNOUNCE_DELAY_MS);
    return () => view.clearTimeout(timer);
  }, [rootRef, zoom]);
  return said;
};

export { useZoomAnnounce };
