/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { canvasOrigin } from '../../../timeline/canvas-origin';
import { currentFocus } from '../../../timeline/current-focus';
import { currentPlan } from '../../../timeline/current-plan';
import { onionPlan } from '../../../timeline/onion-plan';
import { onionGhost } from './onion-ghost';

const paintOnion = (ctx: CanvasRenderingContext2D): void => {
  const target = currentTarget();
  const { onion, playMode, playing } = useTimelineStore.getState();
  const artwork = target ? useDocumentStore.getState().host.view(target.documentId)?.state.artwork : undefined;
  const focus = currentFocus();
  if (!target?.animation || !artwork || !focus || (playing && onion.hideWhilePlaying)) return;
  const { animation, frame } = target.animation;
  const plan = onionPlan(animation, frame.id, currentPlan(focus), onion, playMode);
  if (plan.length === 0) return;
  const origin = canvasOrigin(artwork, animation, frame);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (const layer of plan) {
    ctx.globalAlpha = layer.alpha;
    const colour = layer.side === 'before' ? onion.beforeColour : onion.afterColour;
    const ghost = { frameId: layer.frameId, flip: layer.flip, side: layer.side, tint: onion.tint, colour, style: onion.style, behind: onion.position === 'behind' };
    ctx.drawImage(onionGhost(ctx.canvas, artwork, { ...target, animation: target.animation }, ghost), origin.x, origin.y);
  }
  ctx.restore();
};

export { paintOnion };
