/* @layer renderer-app @kind logic */
import type { PixelRect } from '../../PixelViewport';
import type { ZoomDraft } from './zoom-draft';

const zoomRectOf = (draft: ZoomDraft): PixelRect => ({
  x: Math.min(draft.from.x, draft.to.x),
  y: Math.min(draft.from.y, draft.to.y),
  width: Math.max(1, Math.abs(draft.to.x - draft.from.x)),
  height: Math.max(1, Math.abs(draft.to.y - draft.from.y)),
});

export { zoomRectOf };
