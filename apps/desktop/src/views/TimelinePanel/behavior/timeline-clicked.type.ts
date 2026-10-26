/* @layer renderer-app @kind types */
import type { Frame, Layer, Tag } from '@bxel/document';

interface TimelineClicked {
  kind: 'tag' | 'cel' | 'head' | 'label' | 'none';
  tag?: Tag;
  layer?: Layer;
  frame?: Frame;
}

export type { TimelineClicked };
