/* @layer renderer-app @kind hook */
import { getPlatform, nav, toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { copyPath } from '../../../asset-list/copy-path';
import { duplicateRow } from '../../../asset-list/duplicate-row';
import { openRow } from '../../../asset-list/open-row';
import { revealRow } from '../../../asset-list/reveal-row';
import { trashRow } from '../../../asset-list/trash-row';
import { makeFolder } from '../../../file-ops/make-folder';
import { moveEntries } from '../../../file-ops/move-entries';
import { renameEntryLinked } from '../../../file-ops/rename-entry-linked';
import { trashEntries } from '../../../file-ops/trash-entries';
import { readImage } from '../../../image-import/read-image';
import { pickPaletteFile } from '../../../palette-source/pick-palette-file';
import { SOURCE_DEFAULT } from '../../../palette-source/palette-source.constants';
import { createProjectPalette } from '../../../project-config/create-project-palette';
import { paletteDraft } from '../../../project-config/palette-draft';
import { useEffectiveDefaults } from '../../../asset-defaults/useEffectiveDefaults';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import type { BrowserEntry, FileEntry } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { openProperties } from '../../../properties-subject/open-properties';
import { startNewAsset } from '../../../project/start-new-asset';
import { useImportStore } from '../../../stores/useImportStore';
import type { BrowserActions } from '../ProjectBrowser.type';

const filesOf = (entries: readonly BrowserEntry[]): FileEntry[] => entries.filter((entry): entry is FileEntry => entry.kind === 'file');

const pathOf = (entry: BrowserEntry): string => (entry.kind === 'folder' ? entry.path : entry.row.path);

const openFile = (entry: FileEntry): void => {
  openRow(entry.row);
  nav.close();
};

/** What the Browse page does to files, in one place so the grid, the list, the columns, the keys and the menus all agree. */
const useBrowserActions = (model: BrowserModel): { readonly actions: BrowserActions; readonly renaming: string | null; readonly renameError: string | null } => {
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);
  const defaults = useEffectiveDefaults();
  const { goTo, setQuery, setPinned } = useBrowserStore.getState();

  const open = useCallback((entry: BrowserEntry): void => (entry.kind === 'folder' ? goTo(entry.path) : openFile(entry)), [goTo]);

  const commitRename = useCallback(
    (entry: BrowserEntry, typed: string): void => {
      const path = pathOf(entry);
      if (path === '' || typed.trim() === '') {
        setRenaming(null);
        return;
      }
      void renameEntryLinked(path, typed, entry.kind === 'folder').then((outcome) => {
        setRenameError(outcome.ok ? null : outcome.message);
        if (outcome.ok) setRenaming(null);
      });
    },
    [],
  );

  const newFolder = useCallback((): void => {
    if (model.folder === null) return;
    void makeFolder(model.folder).then((made) => {
      if (made.ok) setRenaming(made.path);
      else toast(BROWSER_TEXT.folderFailed(made.message), { variant: 'danger' });
    });
  }, [model.folder]);

  const importImage = useCallback((): void => {
    const documents = getPlatform().documents;
    if (!documents) return;
    void documents.open({ title: 'Import an image', filters: [{ name: 'Images', extensions: ['png', 'gif', 'bmp'] }] }).then(async (picked) => {
      const path = picked;
      if (path === null) return;
      const read = readImage(await documents.read(path), path.split(/[\\/]/).at(-1) ?? path);
      if (read.ok) {
        nav.close();
        useImportStore.getState().show(read.image);
      } else toast(read.message, { variant: 'warning' });
    });
  }, []);

  const importPalette = useCallback((): void => {
    const documents = getPlatform().documents;
    if (!documents) return;
    void pickPaletteFile(documents).then(async (read) => {
      if (read === null) return;
      if (!read.ok) {
        toast(read.message, { variant: 'warning' });
        return;
      }
      const failed = await createProjectPalette(paletteDraft({ ...SOURCE_DEFAULT, kind: 'file', file: read.palette }, defaults));
      if (failed !== null) toast(failed, { variant: 'danger' });
    });
  }, [defaults]);

  const actions = useMemo<BrowserActions>(
    () => ({
      open,
      openAll: (entries) => {
        const found = filesOf(entries);
        for (const entry of found) openRow(entry.row);
        if (found.length > 0) nav.close();
      },
      properties: (entries) => {
        const first = entries[0];
        if (first?.kind === 'file') openProperties({ path: first.row.path === '' ? null : first.row.path, key: first.key });
      },
      startRename: (id) => {
        setRenameError(null);
        setRenaming(id);
      },
      commitRename,
      cancelRename: () => {
        setRenaming(null);
        setRenameError(null);
      },
      newFolder,
      newAsset: (kind) => {
        nav.close();
        startNewAsset(kind, model.folder ?? undefined);
      },
      trash: (entries) => {
        const loaded = filesOf(entries).filter((entry) => entry.row.loaded && entry.row.kind !== 'image' && entry.row.kind !== 'other');
        const paths = entries.filter((entry) => !loaded.includes(entry as FileEntry)).map(pathOf).filter((path) => path !== '');
        if (loaded.length > 0 && paths.length === 0 && loaded.length === entries.length) {
          for (const entry of loaded) trashRow(entry.row);
          return;
        }
        void trashEntries([...loaded.map(pathOf).filter((path) => path !== ''), ...paths]);
      },
      duplicate: (entries) => {
        for (const entry of filesOf(entries)) duplicateRow(entry.row);
      },
      reveal: (entry) => revealRow({ path: pathOf(entry) }),
      copyPath: (entry) => void copyPath(pathOf(entry)),
      pin: (entries, on) => setPinned(filesOf(entries).map((entry) => entry.id), on),
      moveInto: (ids, folder) => {
        const wanted = new Set(ids);
        const paths = model.entries.filter((entry) => wanted.has(entry.id)).map(pathOf).filter((path) => path !== '');
        void moveEntries(paths, folder);
      },
      importImage,
      importPalette,
      filterBy: setQuery,
    }),
    [open, commitRename, newFolder, importImage, importPalette, model.folder, model.entries, setPinned, setQuery],
  );

  return { actions, renaming, renameError };
};

export { useBrowserActions };
