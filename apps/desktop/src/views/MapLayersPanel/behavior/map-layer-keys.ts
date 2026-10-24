/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { deleteMapLayer } from '../../../tilemap/delete-map-layer';

const mapLayerKeys = (begin: () => void) => (event: KeyboardEvent<HTMLElement>): void => {
  if (event.target instanceof HTMLInputElement) return;
  if (event.key === 'F2') {
    event.preventDefault();
    begin();
  } else if (event.key === 'Delete') {
    event.preventDefault();
    deleteMapLayer();
  }
};

export { mapLayerKeys };
