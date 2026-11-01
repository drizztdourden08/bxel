/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { CombineMode, Connectivity, MaskView, Point } from '@bxel/raster';
import type { Clip, MatchKind, SampleSource, SelectVariant } from '../editor/selection/selection.type';

interface SelectionSettings {
  variant: SelectVariant;
  match: MatchKind;
  distance: number;
  ignoreTransparent: boolean;
  inSelection: boolean;
  mode: CombineMode;
  connectivity: Connectivity;
  sample: SampleSource;
  amount: number;
  owner: DocumentId | null;
  mask: MaskView | null;
  draft: MaskView | null;
  vertices: readonly Point[];
  clipboard: Clip | null;
  systemClip: boolean;
}

interface SelectionState extends SelectionSettings {
  setVariant: (variant: SelectVariant) => void;
  setMode: (mode: CombineMode) => void;
  setConnectivity: (connectivity: Connectivity) => void;
  setMatch: (match: MatchKind) => void;
  setDistance: (distance: number) => void;
  setIgnoreTransparent: (ignore: boolean) => void;
  setInSelection: (inSelection: boolean) => void;
  setSample: (sample: SampleSource) => void;
  setAmount: (amount: number) => void;
  setMask: (mask: MaskView | null, owner: DocumentId | null) => void;
  setDraft: (draft: MaskView | null) => void;
  setVertices: (vertices: readonly Point[]) => void;
  setClipboard: (clipboard: Clip | null) => void;
  setSystemClip: (held: boolean) => void;
}

export type { SelectionSettings, SelectionState };
