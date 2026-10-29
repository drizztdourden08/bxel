/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { MaskView } from '@bxel/raster';
import type { MapSelection } from './tilemap-store.type';

interface SelectionStep {
  documentId: DocumentId;
  tag: number;
  before: MaskView | null;
  after: MaskView | null;
  cells?: { before: MapSelection | null; after: MapSelection | null };
}

interface SelectionHistoryState {
  undo: readonly SelectionStep[];
  redo: readonly SelectionStep[];
  last: MaskView | null;
  record: (step: SelectionStep) => void;
  popUndo: () => SelectionStep | null;
  popRedo: () => SelectionStep | null;
  pushUndo: (step: SelectionStep) => void;
  pushRedo: (step: SelectionStep) => void;
  remember: (mask: MaskView | null) => void;
  reset: () => void;
}

export type { SelectionHistoryState };
