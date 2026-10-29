/* @layer renderer-app @kind logic */
import type { MapSelection } from '../stores/tilemap-store.type';

const selectionCount = (selection: MapSelection): number =>
  selection.mask === null ? selection.rect.width * selection.rect.height : selection.mask.reduce((total, bit) => total + bit, 0);

export { selectionCount };
