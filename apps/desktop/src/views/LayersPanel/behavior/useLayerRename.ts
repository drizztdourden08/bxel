/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { LayerId } from '@bxel/document';
import type { LayerRenameState } from '../LayersPanel.type';

const useLayerRename = (): LayerRenameState => {
  const [renamingId, setRenamingId] = useState<LayerId | null>(null);
  return { renamingId, begin: setRenamingId, finish: () => setRenamingId(null) };
};

export { useLayerRename };
