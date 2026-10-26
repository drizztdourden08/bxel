/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import type { TimelineSelection } from '../stores/timeline-store.type';
import { frameCells } from './frame-cells';
import { tagLanes } from './tag-lanes';
import type { AnimationFocus, TimelineModel } from './timeline.type';

const timelineModel = (focus: AnimationFocus, selection: TimelineSelection, tagId: TagId | null): TimelineModel => ({
  cells: frameCells(focus, selection),
  tagLanes: tagLanes(focus.animation, tagId),
});

export { timelineModel };
