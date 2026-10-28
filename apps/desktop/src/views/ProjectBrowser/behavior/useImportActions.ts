/* @layer renderer-app @kind hook */
import { getPlatform, nav, toast } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { useEffectiveDefaults } from '../../../asset-defaults/useEffectiveDefaults';
import { readImage } from '../../../image-import/read-image';
import { SOURCE_DEFAULT } from '../../../palette-source/palette-source.constants';
import { pickPaletteFile } from '../../../palette-source/pick-palette-file';
import { createProjectPalette } from '../../../project-config/create-project-palette';
import { paletteDraft } from '../../../project-config/palette-draft';
import { useImportStore } from '../../../stores/useImportStore';
import { IMAGE_FILTERS } from '../ProjectBrowser.constants';
import type { ImportActions } from '../ProjectBrowser.type';

const useImportActions = (): ImportActions => {
  const defaults = useEffectiveDefaults();

  const importImage = useCallback((): void => {
    const documents = getPlatform().documents;
    if (!documents) return;
    void documents.open({ title: 'Import an image', filters: IMAGE_FILTERS }).then(async (path) => {
      if (path === null) return;
      const read = readImage(await documents.read(path), path.split(/[\\/]/).at(-1) ?? path);
      if (!read.ok) {
        toast(read.message, { variant: 'warning' });
        return;
      }
      nav.close();
      useImportStore.getState().show(read.image);
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

  return { importImage, importPalette };
};

export { useImportActions };
