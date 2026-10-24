/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import type { TimelineSelection } from '../stores/timeline-store.type';
import type { FrameColumn } from './timeline.type';

const frameColumns = (target: EditorTarget, selection: TimelineSelection): FrameColumn[] =>
  target.sprite.frames.map((frame, index) => ({
    id: frame.id,
    number: index + 1,
    durationMs: frame.durationMs,
    current: frame.id === target.frameId,
    selected: selection.frames.includes(frame.id),
  }));

export { frameColumns };
