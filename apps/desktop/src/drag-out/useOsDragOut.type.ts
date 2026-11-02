/* @layer renderer-app @kind types */
import type { DragEventHandler, PointerEventHandler } from 'react';

type OsDragOutInput = {
  readonly paths: () => readonly string[];
  readonly disabled: boolean;
};

type OsDragOut = {
  readonly holding: () => boolean;
  readonly handlers: {
    readonly onPointerDownCapture: PointerEventHandler<HTMLElement>;
    readonly onPointerUp: PointerEventHandler<HTMLElement>;
    readonly onDragStart: DragEventHandler<HTMLElement>;
    readonly onDragEnd: DragEventHandler<HTMLElement>;
  };
};

export type { OsDragOut, OsDragOutInput };
