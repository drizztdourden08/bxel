/* @layer renderer-app @kind hook */
import { announce } from '@drizztdourden08/brock-react';
import { useCallback, useRef } from 'react';
import type { BrowserEdit, EditInput, EditTarget } from './browser-state.type';
import { runEdit } from './run-edit';
import { useFolderStart } from './useFolderStart';

const useBrowserEdit = ({ state, itemOf, selection, view, refresh }: EditInput): BrowserEdit => {
  const { editing, error, setEditing, setError } = state;
  const active = useRef<EditTarget | null>(null);
  const busy = useRef(false);

  const begin = useCallback(
    (target: EditTarget) => {
      active.current = target;
      setError(null);
      setEditing(target);
    },
    [setEditing, setError],
  );
  const stop = useCallback(() => {
    active.current = null;
    setEditing(null);
    setError(null);
  }, [setEditing, setError]);
  const startRename = useCallback(
    (key: string) => {
      selection.choose([key]);
      begin({ kind: 'rename', key });
    },
    [selection, begin],
  );
  const startSprite = useCallback(
    (parentKey: string) => {
      view.setOpen([parentKey], true);
      begin({ kind: 'create', parentKey, create: 'sprite' });
    },
    [view, begin],
  );
  const startFolder = useFolderStart({ itemOf, view, refresh, begin, selection, setError });

  const commit = useCallback(
    async (typed: string): Promise<void> => {
      const target = active.current;
      if (target === null || busy.current) return;
      busy.current = true;
      const outcome = await runEdit(target, typed.trim(), itemOf);
      busy.current = false;
      if (active.current !== target) return;
      if (!outcome.ok) {
        setError(outcome.message);
        return;
      }
      refresh();
      announce(target.kind === 'rename' ? `Renamed to ${typed.trim()}` : `Created ${typed.trim()}`);
      if (target.kind === 'rename') selection.reveal(target.key, true);
      stop();
    },
    [itemOf, refresh, selection, setError, stop],
  );

  return { editing, error, startRename, startFolder, startSprite, stop, commit };
};

export { useBrowserEdit };
