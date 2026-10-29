/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { StripFile } from '../../add-frames/image-drop.type';
import type { AnimationFocus } from '../../timeline/timeline.type';

interface FocusDialogProps {
  focus: AnimationFocus;
}

interface FileDialogProps extends FocusDialogProps {
  file: StripFile;
}

interface AddFramesShellProps {
  title: string;
  canAdd: boolean;
  onAdd: () => void;
  children: ReactNode;
}

export type { AddFramesShellProps, FileDialogProps, FocusDialogProps };
