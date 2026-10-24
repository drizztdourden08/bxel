/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { CombineMode, Connectivity, MaskView, Point } from '@bxel/raster';
import type { Clip, SelectVariant } from '../editor/selection/selection.type';

interface SelectionSettings {
  variant: SelectVariant;
  mode: CombineMode;
  connectivity: Connectivity;
  owner: DocumentId | null;
  mask: MaskView | null;
  draft: MaskView | null;
  vertices: readonly Point[];
  clipboard: Clip | null;
}

interface SelectionState extends SelectionSettings {
  setVariant: (variant: SelectVariant) => void;
  setMode: (mode: CombineMode) => void;
  setConnectivity: (connectivity: Connectivity) => void;
  setMask: (mask: MaskView | null, owner: DocumentId | null) => void;
  setDraft: (draft: MaskView | null) => void;
  setVertices: (vertices: readonly Point[]) => void;
  setClipboard: (clipboard: Clip | null) => void;
}

export type { SelectionSettings, SelectionState };
