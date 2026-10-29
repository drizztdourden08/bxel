/* @layer renderer-app @kind types */
import type { TagBar } from '../../../timeline/timeline.type';
import type { TagDrag } from '../behavior/useTagDrag.type';

interface TagBarEdgesProps {
  bar: TagBar;
  drag: TagDrag;
}

export type { TagBarEdgesProps };
