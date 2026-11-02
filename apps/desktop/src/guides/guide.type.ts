/* @layer renderer-app @kind types */
type GuideAxis = 'x' | 'y';

interface GuideDrag {
  axis: GuideAxis;
  from: number | null;
  position: number | null;
}

interface GuidePoint {
  clientX: number;
  clientY: number;
}

interface GuideHit {
  axis: GuideAxis;
  position: number;
}

interface GuideFrame {
  pixelToScreen: (x: number, y: number) => { x: number; y: number };
  view: () => { zoom: number };
}

interface GuideRequest {
  axis: GuideAxis;
  length: number;
  whole: boolean;
  step?: number | null;
}

interface GuideLines {
  readonly x: readonly number[];
  readonly y: readonly number[];
}

interface PersistedGuides {
  lines: GuideLines | undefined;
  size: () => { width: number; height: number } | null;
  step: (axis: GuideAxis) => number | null;
  write: (label: string, guides: GuideLines) => void;
}

interface GuideScope {
  lines: () => GuideLines | undefined;
  size: () => { width: number; height: number } | null;
  step: (axis: GuideAxis) => number | null;
  add: (axis: GuideAxis, position: number) => void;
  move: (axis: GuideAxis, from: number, to: number) => void;
  remove: (axis: GuideAxis, position: number) => void;
  clear: () => void;
}

interface GuideEdit {
  axis: GuideAxis;
  from: number | null;
  to: number;
}

interface GuideRow {
  axis: GuideAxis;
  position: number;
}

interface GuideDialogRequest {
  axis: GuideAxis;
  from: number | null;
  position: number;
}

interface LastGuideHit extends GuideHit {
  at: number;
}

export type { GuideAxis, GuideDialogRequest, GuideDrag, GuideEdit, GuideFrame, GuideHit, GuideLines, GuidePoint, GuideRequest, GuideRow, GuideScope, LastGuideHit, PersistedGuides };
