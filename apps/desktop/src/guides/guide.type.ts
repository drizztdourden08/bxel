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
}

export type { GuideAxis, GuideDrag, GuideFrame, GuideHit, GuidePoint, GuideRequest };
