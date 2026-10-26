/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { canvasOrigin } from '../../../timeline/canvas-origin';
import { onionPlan } from '../../../timeline/onion-plan';
import { onionGhost } from './onion-ghost';

const paintOnion = (ctx: CanvasRenderingContext2D): void => {
  const target = currentTarget();
  const { onion, tagId } = useTimelineStore.getState();
  const artwork = target ? useDocumentStore.getState().host.view(target.documentId)?.state.artwork : undefined;
  if (!target?.animation || !artwork) return;
  const { animation, frame } = target.animation;
  const plan = onionPlan(animation, frame.id, tagId, onion);
  if (plan.length === 0) return;
  const origin = canvasOrigin(artwork, animation, frame);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (const layer of plan) {
    ctx.globalAlpha = layer.alpha;
    const ghost = onionGhost(ctx.canvas, artwork, { ...target, animation: target.animation }, { frameId: layer.frameId, flip: layer.flip, side: layer.side, tint: onion.tint });
    ctx.drawImage(ghost, origin.x, origin.y);
  }
  ctx.restore();
};

export { paintOnion };
