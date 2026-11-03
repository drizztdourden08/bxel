/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { CombineMode, Connectivity, MaskView, Point } from '@bxel/raster';
import type { Clip, FixedMarquee, MatchKind, PasteColours, SampleSource, SelectVariant, VertexSnap } from '../editor/selection/selection.type';

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
  nudge: number;
  fixed: FixedMarquee;
  fixedWidth: number;
  fixedHeight: number;
  mirror: boolean;
  vertexSnap: VertexSnap;
  pasteColours: PasteColours;
  quickMask: boolean;
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
  setNudge: (nudge: number) => void;
  setFixed: (fixed: FixedMarquee) => void;
  setFixedWidth: (width: number) => void;
  setFixedHeight: (height: number) => void;
  setMirror: (mirror: boolean) => void;
  setVertexSnap: (snap: VertexSnap) => void;
  setPasteColours: (colours: PasteColours) => void;
  setQuickMask: (on: boolean) => void;
  setMask: (mask: MaskView | null, owner: DocumentId | null) => void;
  setDraft: (draft: MaskView | null) => void;
  setVertices: (vertices: readonly Point[]) => void;
  setClipboard: (clipboard: Clip | null) => void;
  setSystemClip: (held: boolean) => void;
}

export type { SelectionSettings, SelectionState };
