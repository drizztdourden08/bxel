/* @layer renderer-app @kind hook */
import { getPlatform, nav, toast } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { useEffectiveDefaults } from '../../../asset-defaults/useEffectiveDefaults';
import { dropFiles as dropIntoProject } from '../../../file-ops/drop-files';
import { readImage } from '../../../image-import/read-image';
import { pickPaletteFile } from '../../../palette-source/pick-palette-file';
import { addPaletteFromRead } from '../../../project-config/add-palette-from-read';
import { startTiledImport } from '../../../tiled-import/start-tiled-import';
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
    void pickPaletteFile(documents).then((read) => {
      if (read !== null) void addPaletteFromRead(read, defaults);
    });
  }, [defaults]);

  const importTiled = useCallback((): void => void startTiledImport(), []);

  const dropFiles = useCallback((files: readonly File[], folder: string): void => void dropIntoProject(files, folder, defaults), [defaults]);

  return { importImage, importPalette, importTiled, dropFiles };
};

export { useImportActions };
