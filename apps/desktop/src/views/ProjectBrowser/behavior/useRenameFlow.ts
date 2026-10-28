/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useState } from 'react';
import { makeFolder } from '../../../file-ops/make-folder';
import { renameEntryLinked } from '../../../file-ops/rename-entry-linked';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { pathOfEntry } from '../../../project-browser/path-of-entry';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import type { RenameFlow } from '../ProjectBrowser.type';

const useRenameFlow = (folder: string | null): RenameFlow => {
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

  const startRename = useCallback((id: string): void => {
    setRenameError(null);
    setRenaming(id);
  }, []);

  const cancelRename = useCallback((): void => {
    setRenaming(null);
    setRenameError(null);
  }, []);

  const commitRename = useCallback((entry: BrowserEntry, typed: string): void => {
    const path = pathOfEntry(entry);
    if (path === '' || typed.trim() === '') {
      setRenaming(null);
      return;
    }
    void renameEntryLinked(path, typed, entry.kind === 'folder').then((outcome) => {
      setRenameError(outcome.ok ? null : outcome.message);
      if (outcome.ok) setRenaming(null);
    });
  }, []);

  const newFolder = useCallback((): void => {
    if (folder === null) return;
    void makeFolder(folder).then((made) => {
      if (made.ok) setRenaming(made.path);
      else toast(BROWSER_TEXT.folderFailed(made.message), { variant: 'danger' });
    });
  }, [folder]);

  return { renaming, renameError, startRename, cancelRename, commitRename, newFolder };
};

export { useRenameFlow };
