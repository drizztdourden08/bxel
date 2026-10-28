/* @layer renderer-app @kind types */
import type { CellFlags } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';

interface MapFlags {
  flags: CellFlags;
  selection: MapSelection | null;
  showTurn: boolean;
  showSelection: boolean;
}

export type { MapFlags };
