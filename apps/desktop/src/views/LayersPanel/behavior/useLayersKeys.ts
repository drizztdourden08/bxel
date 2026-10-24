/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import type { LayerId } from '@bxel/document';
import { deleteLayer } from '../../../editor/delete-layer';

const useLayersKeys = (activeId: LayerId | null, begin: (layerId: LayerId) => void) => (event: KeyboardEvent<HTMLElement>): void => {
  if (activeId === null || event.target instanceof HTMLInputElement) return;
  if (event.key === 'F2') {
    event.preventDefault();
    begin(activeId);
  } else if (event.key === 'Delete') {
    event.preventDefault();
    deleteLayer();
  }
};

export { useLayersKeys };
