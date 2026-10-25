/* @layer renderer-app @kind types */
import type { KeyboardEventHandler, PointerEventHandler, RefObject } from 'react';
import type { CanvasLook, SurroundKind } from '../../canvas-look/canvas-look.type';

interface SurroundModel {
  look: CanvasLook;
  kind: SurroundKind;
  bits: string;
  setBits: (bits: string) => void;
  clear: () => void;
  invert: () => void;
  copyChosen: () => void;
}

interface PatternGridArgs {
  bits: string;
  look: CanvasLook;
  onChange: (bits: string) => void;
}

interface PatternGridModel {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  boxRef: RefObject<HTMLElement | null>;
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  onFocus: () => void;
  onBlur: () => void;
}

interface PatternGridProps {
  bits: string;
  look: CanvasLook;
  onChange: (bits: string) => void;
}

export type { PatternGridArgs, PatternGridModel, PatternGridProps, SurroundModel };
