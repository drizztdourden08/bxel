/* @layer renderer-app @kind types */
import type { TagBar } from '../../../timeline/timeline.type';
import type { TagDrag } from '../behavior/useTagDrag.type';

interface TagBarBodyProps {
  bar: TagBar;
  roving: boolean;
  editable: boolean;
  drag: TagDrag;
}

export type { TagBarBodyProps };
