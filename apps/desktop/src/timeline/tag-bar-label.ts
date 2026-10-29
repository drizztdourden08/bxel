/* @layer renderer-app @kind logic */
import { FACING_TEXT, TAG_DIRECTION_TEXT, TIMELINE_TEXT } from './timeline.constants';
import type { TagBar } from './timeline.type';

const repeatText = (repeat: number): string => {
  if (repeat === 0) return 'repeats forever';
  if (repeat === 1) return 'repeats once';
  if (repeat === 2) return 'repeats twice';
  return `repeats ${repeat} times`;
};

const tagBarLabel = (bar: Omit<TagBar, 'label'>): string => {
  const parts = [bar.name, bar.mirror ? `mirrored ${bar.flip ?? ''}`.trim() : TAG_DIRECTION_TEXT[bar.direction].toLowerCase()];
  if (!bar.mirror && bar.repeat > 0) parts.push(repeatText(bar.repeat));
  parts.push(TIMELINE_TEXT.framesRange(bar.start + 1, bar.end + 1));
  if (bar.facing !== null) parts.push(`facing ${FACING_TEXT[bar.facing]}`);
  return parts.join(', ');
};

export { tagBarLabel };
