/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { onionPlan } from '../../../timeline/onion-plan';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { onionGhost } from './onion-ghost';

const paintOnion = (ctx: CanvasRenderingContext2D): void => {
  const target = currentTarget();
  const { onion } = useTimelineStore.getState();
  if (!target) return;
  const plan = onionPlan(target.sprite, target.frameId, onion);
  if (plan.length === 0) return;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (const layer of plan) {
    ctx.globalAlpha = layer.alpha;
    ctx.drawImage(onionGhost(ctx.canvas, target, { frameId: layer.frameId, side: layer.side, tint: onion.tint }), 0, 0);
  }
  ctx.restore();
};

export { paintOnion };
