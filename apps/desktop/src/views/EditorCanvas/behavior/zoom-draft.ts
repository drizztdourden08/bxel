/* @layer renderer-app @kind logic */
import type { ZoomDraft } from './zoom-draft.type';

const zoomDraft: { current: ZoomDraft | null } = { current: null };

export { zoomDraft };
