/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { AnimationFocus } from '../../timeline/timeline.type';

interface FocusDialogProps {
  focus: AnimationFocus;
}

interface AddFramesShellProps {
  title: string;
  canAdd: boolean;
  onAdd: () => void;
  children: ReactNode;
}

export type { AddFramesShellProps, FocusDialogProps };
