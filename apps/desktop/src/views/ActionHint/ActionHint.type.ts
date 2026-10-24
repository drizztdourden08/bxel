/* @layer renderer-app @kind types */
import type { MouseButton, ShortcutKey, TooltipPlacement } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';

interface HintShortcut {
  command?: string;
  keys?: readonly ShortcutKey[];
  mouse?: MouseButton;
  label?: string;
}

interface HintSpec {
  name: string;
  description: string;
  shortcuts?: readonly HintShortcut[];
}

interface HintCombo {
  keys: readonly ShortcutKey[];
  mouse?: MouseButton;
}

interface HintedOption<T extends string> {
  value: T;
  label: string;
  hint: HintSpec;
  disabled?: boolean | string;
}

interface ActionHintProps {
  hint?: HintSpec;
  placement?: TooltipPlacement;
  className?: string;
  children: ReactNode;
}

interface HintBodyProps {
  hint: HintSpec;
}

interface HintShortcutRowProps {
  shortcut: HintShortcut;
}

export type { ActionHintProps, HintBodyProps, HintCombo, HintShortcut, HintShortcutRowProps, HintSpec, HintedOption };
