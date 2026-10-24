/* @layer renderer-app @kind types */
import type { KeyboardEventHandler, PointerEventHandler, RefObject } from 'react';

interface PatternPointerArgs {
  bits: RefObject<string>;
  apply: (index: number, on: boolean) => void;
  setCursor: (index: number | null) => void;
}

interface PatternPointer {
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
}

interface PatternKeysArgs {
  bits: RefObject<string>;
  cursor: number | null;
  apply: (index: number, on: boolean) => void;
  setCursor: (index: number | null) => void;
}

interface PatternKeys {
  onKeyDown: KeyboardEventHandler<HTMLElement>;
}

export type { PatternKeys, PatternKeysArgs, PatternPointer, PatternPointerArgs };
