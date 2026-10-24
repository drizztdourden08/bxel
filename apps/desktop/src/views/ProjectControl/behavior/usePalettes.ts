/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { getPlatform } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { useEffectiveDefaults } from '../../../asset-defaults/useEffectiveDefaults';
import { SOURCE_DEFAULT } from '../../../palette-source/palette-source.constants';
import { pickPaletteFile } from '../../../palette-source/pick-palette-file';
import { sourceFromSet } from '../../../palette-source/source-from-set';
import { createProjectPalette } from '../../../project-config/create-project-palette';
import { exportPaletteFile } from '../../../project-config/export-palette-file';
import { focusedProject } from '../../../project-config/focused-project';
import { paletteDraft } from '../../../project-config/palette-draft';
import { revealPaletteFile } from '../../../project-config/reveal-palette-file';
import { PROJECT_CONFIG_TEXT } from '../../../project-config/project-config.constants';
import type { ProjectOutcomeText } from '../../../project-config/project-config.type';
import { findLibrarySet } from '../../../swatch-library/find-library-set';
import { setSelectGroups } from '../../../swatch-library/set-select-groups';
import { useSwatchLibrary } from '../../../swatch-library/useSwatchLibrary';
import { focusTab } from '../../../workspace/focus-tab';
import { tabOf } from '../../../workspace/tab-of';
import type { PalettesModel } from '../ProjectControl.type';
import { usePaletteFiles } from './usePaletteFiles';

const usePalettes = (): PalettesModel => {
  const files = usePaletteFiles();
  const defaults = useEffectiveDefaults();
  const library = useSwatchLibrary();
  const groups = useMemo(() => setSelectGroups(library.groups), [library]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (task: () => Promise<ProjectOutcomeText>): Promise<void> => {
    setBusy(true);
    const failed = await task();
    setBusy(false);
    setError(failed);
    if (failed === null) toast(PROJECT_CONFIG_TEXT.paletteDone, { variant: 'success' });
  }, []);

  const create = useCallback(() => void run(() => createProjectPalette(paletteDraft(SOURCE_DEFAULT, defaults))), [run, defaults]);

  const addFromLibrary = useCallback(
    (key: string) =>
      void run(async () => {
        const set = findLibrarySet(library, key);
        return set ? createProjectPalette(paletteDraft(sourceFromSet(set, SOURCE_DEFAULT), defaults)) : PROJECT_CONFIG_TEXT.noSet;
      }),
    [run, library, defaults],
  );

  const importFile = useCallback(
    () =>
      void run(async () => {
        const { documents } = getPlatform();
        const read = documents ? await pickPaletteFile(documents) : null;
        if (read === null) return null;
        if (!read.ok) return read.message;
        return createProjectPalette(paletteDraft({ ...SOURCE_DEFAULT, kind: 'file', file: read.palette }, defaults));
      }),
    [run, defaults],
  );

  const exportFile = useCallback(
    (id: string) =>
      void run(async () => {
        const { documents } = getPlatform();
        const bank = focusedProject()?.artwork?.banks.find((each) => each.id === id);
        return documents && bank ? exportPaletteFile(documents, bank) : null;
      }),
    [run],
  );

  const open = useCallback((id: string): void => {
    const documentId = focusedProject()?.documentId;
    if (documentId) focusTab(tabOf(documentId, { kind: 'palette', id }));
  }, []);

  return { files, groups, busy, error, create, importFile, addFromLibrary, exportFile, open, reveal: revealPaletteFile };
};

export { usePalettes };
