/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { PreviewLayer } from '../../../asset-overview/asset-overview.type';
import { tilemapLayers } from '../../../asset-overview/tilemap-layers';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from './useBrowserContext';

const NO_LAYERS: readonly PreviewLayer[] = [];

const useLayerToggles = (entry: FileEntry) => {
  const { model } = useBrowserContext();
  const [flipped, setFlipped] = useState<ReadonlySet<string>>(() => new Set());
  const key = entry.key;
  const layers = useMemo(() => (model.artwork && key?.kind === 'tilemap' ? tilemapLayers(model.artwork, key.id) : NO_LAYERS), [model.artwork, key]);
  const toggle = useCallback(
    (id: string) =>
      setFlipped((current) => {
        const next = new Set(current);
        if (!next.delete(id)) next.add(id);
        return next;
      }),
    [],
  );
  return { layers, flipped, toggle };
};

export { useLayerToggles };
