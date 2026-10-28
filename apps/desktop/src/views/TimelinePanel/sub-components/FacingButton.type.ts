/* @layer renderer-app @kind types */
import type { AnimFacing, TagId } from '@bxel/document';
import type { FocusProps } from '../TimelinePanel.type';

interface FacingButtonProps extends FocusProps {
  facing: AnimFacing;
  tagId: TagId | null;
}

export type { FacingButtonProps };
