/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import type { LayerId } from '@bxel/document';
import { deleteLayer } from '../../../editor/delete-layer';
import { rowLayerId } from '../../../editor/row-layer-id';
import { useToolStore } from '../../../stores/useToolStore';

const useLayersKeys = (begin: (layerId: LayerId) => void) => (event: KeyboardEvent<HTMLElement>): void => {
  const layerId = rowLayerId(event.target, false);
  if (layerId === null) return;
  if (event.key === 'F2') {
    event.preventDefault();
    begin(layerId);
  } else if (event.key === 'Delete') {
    event.preventDefault();
    useToolStore.getState().setLayer(layerId);
    deleteLayer();
  }
};

export { useLayersKeys };
