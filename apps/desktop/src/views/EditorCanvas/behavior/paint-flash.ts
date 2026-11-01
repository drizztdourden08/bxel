/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { useAssistantPresenceStore } from '../../../stores/useAssistantPresenceStore';
import { FLASH_ALPHA } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const paintFlash = (ctx: CanvasRenderingContext2D, look: OverlayLook): void => {
  const { flashes } = useAssistantPresenceStore.getState();
  if (flashes.length === 0) return;
  const target = currentTarget();
  if (!target) return;
  ctx.save();
  ctx.globalAlpha = FLASH_ALPHA;
  ctx.fillStyle = look.ink;
  for (const flash of flashes) {
    if (flash.documentId !== target.documentId || flash.spriteId !== target.sprite.id || flash.frameId !== target.frameId) continue;
    ctx.fillRect(flash.rect.x, flash.rect.y, flash.rect.width, flash.rect.height);
  }
  ctx.restore();
};

export { paintFlash };
