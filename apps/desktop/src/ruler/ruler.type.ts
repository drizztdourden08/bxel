/* @layer renderer-app @kind types */
import type { SymmetryAxis } from '../stores/tool-store.type';
import type { UnitScale } from './ruler-unit.type';

interface RulerSpan {
  origin: number;
  zoom: number;
  length: number;
  count: number;
  unit?: UnitScale;
}

interface AlongRect {
  along: number;
  across: number;
  alongSize: number;
  acrossSize: number;
}

interface RulerTick {
  value: number;
  at: number;
  label: boolean;
  text: string;
}

interface RulerLook {
  ground: string;
  line: string;
  text: string;
  cursor: string;
  axis: string;
  font: string;
}

interface RulerPlan {
  axis: SymmetryAxis;
  span: RulerSpan;
  cursor: number | null;
  handle: number | null;
}

interface RulerFrame {
  ctx: CanvasRenderingContext2D;
  axis: SymmetryAxis;
  length: number;
  thickness: number;
  look: RulerLook;
}

interface RulerView {
  originX: number;
  originY: number;
  zoom: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
}

interface RulerState extends RulerView {
  setView: (view: RulerView) => void;
}

export type { AlongRect, RulerFrame, RulerLook, RulerPlan, RulerSpan, RulerState, RulerTick, RulerView };
