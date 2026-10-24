/* @layer renderer-app @kind types */
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { MouseEventHandler, FocusEventHandler, KeyboardEventHandler } from 'react';
import type { ToolDef } from '../../editor/tool.type';

interface ToolButtonProps {
  def: ToolDef;
  active: boolean;
  onSelect: () => void;
}

interface ToolFlyoutProps extends ToolButtonProps {
  groups: readonly MenuGroup[];
}

interface FlyoutHandlers {
  onMouseEnter: MouseEventHandler<HTMLElement>;
  onMouseLeave: MouseEventHandler<HTMLElement>;
  onFocus: FocusEventHandler<HTMLElement>;
  onBlur: FocusEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
}

interface FlyoutOpen {
  open: boolean;
  close: () => void;
  handlers: FlyoutHandlers;
}

export type { FlyoutOpen, ToolButtonProps, ToolFlyoutProps };
