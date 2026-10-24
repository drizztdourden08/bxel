/* @layer renderer-app @kind test */
import type { TimelineKeyInfo } from '../../src/views/TimelinePanel/TimelinePanel.type';

const key = (name: string, extra: Partial<TimelineKeyInfo> = {}): TimelineKeyInfo => ({
  key: name,
  shiftKey: false,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  ...extra,
});

export { key };
