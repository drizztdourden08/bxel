/* @layer renderer-app @kind types */
import type { AnimFrameId } from '@bxel/document';
import type { FocusProps } from '../TimelinePanel.type';

interface GhostThumbProps extends FocusProps {
  frameId: AnimFrameId;
}

export type { GhostThumbProps };
