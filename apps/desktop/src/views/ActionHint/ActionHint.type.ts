/* @layer renderer-app @kind types */
import type { MouseButton, ShortcutKey } from '@drizztdourden08/tessera';
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

interface ActionHintProps {
  hint?: HintSpec;
  placement?: 'top' | 'bottom';
  className?: string;
  children: ReactNode;
}

interface HintBodyProps {
  hint: HintSpec;
}

interface HintShortcutRowProps {
  shortcut: HintShortcut;
}

interface ChoiceHint {
  spec: HintSpec | undefined;
  onHint: (hint: { label: string; description: string } | null) => void;
}

export type { ActionHintProps, ChoiceHint, HintBodyProps, HintCombo, HintShortcut, HintShortcutRowProps, HintSpec };
