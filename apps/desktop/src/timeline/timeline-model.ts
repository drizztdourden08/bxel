/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import type { TimelineSelection } from '../stores/timeline-store.type';
import type { TagId } from '@bxel/document';
import { frameColumns } from './frame-columns';
import { layerRows } from './layer-rows';
import { tagLanes } from './tag-lanes';
import type { TimelineModel } from './timeline.type';

const timelineModel = (target: EditorTarget, selection: TimelineSelection, tagId: TagId | null): TimelineModel => {
  return {
    columns: frameColumns(target, selection),
    rows: layerRows(target, selection),
    tagLanes: tagLanes(target.sprite, tagId),
  };
};

export { timelineModel };
