/* @layer renderer-app @kind logic */
import type { BrushResizeDraft } from './brush-resize-draft.type';

const brushResizeDraft: { current: BrushResizeDraft | null } = { current: null };

export { brushResizeDraft };
