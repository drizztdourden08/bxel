/* @layer renderer-app @kind types */
import type { SpriteId } from '@bxel/document';
import type { FocusEventHandler, KeyboardEventHandler, ReactNode } from 'react';

type CanvasFrameProps = {
  readonly className: string;
  readonly spriteId: SpriteId | null;
  readonly onBlur: FocusEventHandler<HTMLElement>;
  readonly onKeyUp: KeyboardEventHandler<HTMLElement>;
  readonly children: ReactNode;
};

export type { CanvasFrameProps };
