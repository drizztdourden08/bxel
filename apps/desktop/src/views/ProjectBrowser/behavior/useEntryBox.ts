/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useEntryHandlers } from './useEntryHandlers';
import { useFolderDrop } from './useFolderDrop';

const useEntryBox = (entry: BrowserEntry) => {
  const ref = useRef<HTMLElement>(null);
  const handlers = useEntryHandlers(entry, ref);
  const over = useFolderDrop(ref, entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  return { ref, handlers, over, label };
};

export { useEntryBox };
