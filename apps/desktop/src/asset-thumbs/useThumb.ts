/* @layer renderer-app @kind hook */
import { useEffect, useSyncExternalStore } from 'react';
import type { BrowserItem } from '../project-browser/project-browser.type';
import { thumbRequestFor } from './thumb-request-for';
import { thumbStore } from './thumb-store';

const useThumb = (item: BrowserItem): string | null => {
  const artwork = useSyncExternalStore(thumbStore.subscribe, thumbStore.artwork);
  const entry = useSyncExternalStore(thumbStore.subscribe, () => thumbStore.read(item.key));
  useEffect(() => {
    const request = thumbRequestFor(item, artwork);
    if (request !== null) thumbStore.request(request);
  }, [item, artwork]);
  return item.row?.preview ?? entry?.url ?? null;
};

export { useThumb };
