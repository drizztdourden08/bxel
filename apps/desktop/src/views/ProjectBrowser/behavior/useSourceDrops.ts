/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from './useBrowserContext';
import type { FolderDropPayload } from './useFolderDrop.type';
import type { SourceDrops } from './useSourceDrops.type';

const assetsOf = (payload: FolderDropPayload): readonly DragAsset[] => ('files' in payload ? [] : payload);

const useSourceDrops = (): SourceDrops => {
  const { model, actions } = useBrowserContext();
  return useMemo<SourceDrops>(() => {
    const withEntries = (payload: FolderDropPayload, run: (entries: readonly FileEntry[]) => void): void => {
      const paths = new Set(assetsOf(payload).map((asset) => asset.path));
      const entries = model.everyFile.filter((entry) => paths.has(entry.row.path) && entry.row.assetId !== null);
      if (entries.length > 0) run(entries);
    };
    const editable = (): boolean => model.editable;
    return {
      folders: {
        files: true,
        canDrop: (key) => model.editable && key !== '',
        onDrop: (key, payload) => {
          if ('files' in payload) actions.dropFiles(payload.files.map((each) => each.file), key);
          else actions.moveInto(payload.map((asset) => asset.id), key);
        },
      },
      tags: { canDrop: editable, onDrop: (key, payload) => withEntries(payload, (entries) => actions.tag(entries, key)) },
      collections: { canDrop: editable, onDrop: (key, payload) => withEntries(payload, (entries) => actions.collect(entries, key, true)) },
    };
  }, [model.editable, model.everyFile, actions]);
};

export { useSourceDrops };
