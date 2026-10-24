/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { useAreaStore } from '../../../stores/useAreaStore';
import { AREA_FILL_ALPHA, AREA_LINE } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';
import type { AreaContext, AreaView } from './paint-areas.type';

const paintAreas = (ctx: AreaContext, view: AreaView, look: OverlayLook): void => {
  const { highlight } = useAreaStore.getState();
  const target = currentTarget();
  if (highlight === null || target?.sprite.id !== highlight.spriteId) return;
  const rects = highlight.frames[target.frameId] ?? [];
  if (rects.length === 0) return;
  const line = AREA_LINE / view.zoom;
  ctx.save();
  ctx.fillStyle = look.cursor;
  ctx.strokeStyle = look.cursor;
  ctx.lineWidth = line;
  for (const rect of rects) {
    ctx.globalAlpha = AREA_FILL_ALPHA;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.globalAlpha = 1;
    ctx.strokeRect(rect.x + line / 2, rect.y + line / 2, rect.width - line, rect.height - line);
  }
  ctx.restore();
};

export { paintAreas };
