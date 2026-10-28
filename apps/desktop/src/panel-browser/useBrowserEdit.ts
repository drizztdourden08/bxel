/* @layer renderer-app @kind hook */
import { announce } from '@drizztdourden08/brock-react';
import { useCallback, useRef } from 'react';
import { newProjectFile } from '../project/new-project-file';
import { newProjectFolder } from '../project/new-project-folder';
import type { ProjectOutcome } from '../project/project.type';
import { renameItem } from './rename-item';
import type { BrowserEdit, EditInput, EditTarget } from './project-browser.type';

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
  const startCreate = useCallback(
    (parentKey: string, create: 'folder' | 'sprite') => {
      view.setOpen([parentKey], true);
      begin({ kind: 'create', parentKey, create });
    },
    [view, begin],
  );

  const run = useCallback(
    async (target: EditTarget, typed: string): Promise<ProjectOutcome> => {
      if (target.kind === 'rename') {
        const item = itemOf(target.key);
        return item ? renameItem(item, typed) : { ok: true };
      }
      const parent = itemOf(target.parentKey)?.path ?? '';
      return target.create === 'folder' ? newProjectFolder(parent, typed) : newProjectFile(parent, typed);
    },
    [itemOf],
  );

  const commit = useCallback(
    async (typed: string): Promise<void> => {
      const target = active.current;
      if (target === null || busy.current) return;
      busy.current = true;
      const outcome = await run(target, typed.trim());
      busy.current = false;
      if (active.current !== target) return;
      if (!outcome.ok) {
        setError(outcome.message);
        return;
      }
      refresh();
      announce(target.kind === 'rename' ? `Renamed to ${typed.trim()}` : `Created ${typed.trim()}`);
      if (target.kind === 'rename') selection.focusOn(target.key, true);
      stop();
    },
    [run, refresh, selection, setError, stop],
  );

  return {
    editing,
    error,
    startRename,
    startFolder: (parent) => startCreate(parent, 'folder'),
    startSprite: (parent) => startCreate(parent, 'sprite'),
    stop,
    commit,
  };
};

export { useBrowserEdit };
