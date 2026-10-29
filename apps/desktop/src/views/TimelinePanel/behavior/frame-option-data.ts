/* @layer renderer-app @kind logic */
import type { ReorderDrag } from '@drizztdourden08/tessera';
import type { FrameCell } from '../../../timeline/timeline.type';
import { yesNo } from './yes-no';

const frameOptionData = (cell: FrameCell, index: number, mark: ReturnType<ReorderDrag['dropMark']>, dragging: boolean): Record<string, string | number | undefined> => ({
  'data-reorder-index': index,
  'data-reorder-key': cell.id,
  'data-marquee-key': cell.id,
  'data-frame-id': cell.id,
  'data-roving': yesNo(cell.current),
  'data-drop': mark,
  'data-dragging': dragging ? 'yes' : undefined,
  'data-current': yesNo(cell.current),
  'data-selected': yesNo(cell.selected),
  'data-empty': cell.badges.includes('empty') ? 'yes' : undefined,
  'data-link-prev': cell.linkedTo !== null ? 'yes' : undefined,
  'data-link-next': cell.linkedNext ? 'yes' : undefined,
});

export { frameOptionData };
