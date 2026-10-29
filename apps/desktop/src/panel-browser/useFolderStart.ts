/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { makeFolder } from '../file-ops/make-folder';
import type { FolderStartInput } from './browser-state.type';

const useFolderStart = ({ itemOf, view, refresh, begin, selection, setError }: FolderStartInput): ((parentKey: string) => void) =>
  useCallback(
    (parentKey: string) => {
      const parent = itemOf(parentKey);
      if (parent === undefined) return;
      view.setOpen([parentKey], true);
      void makeFolder(parent.path).then((made) => {
        if (!made.ok) {
          setError(made.message);
          return;
        }
        refresh();
        begin({ kind: 'rename', key: made.path });
        selection.reveal(made.path);
      });
    },
    [itemOf, view, refresh, begin, selection, setError],
  );

export { useFolderStart };
