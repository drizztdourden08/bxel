/* @layer renderer-app @kind logic */
import type { TagBar } from '../../../timeline/timeline.type';
import type { TagDraft } from './useTagDrag.type';
import { yesNo } from './yes-no';

const tagBarData = (bar: TagBar, draft: TagDraft | null): Record<string, string | undefined> => ({
  'data-colour': bar.custom === null ? bar.colour : 'custom',
  'data-mirror': yesNo(bar.mirror),
  'data-selected': yesNo(bar.selected),
  'data-dragging': draft ? 'yes' : undefined,
});

export { tagBarData };
