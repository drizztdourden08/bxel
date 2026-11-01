/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { useViewStore } from '../../../stores/useViewStore';
import { canvasOrigin } from '../../../timeline/canvas-origin';
import { currentFocus } from '../../../timeline/current-focus';
import { currentPlan } from '../../../timeline/current-plan';
import { onionGhostOf } from '../../../timeline/onion-ghost-of';
import { onionPlan } from '../../../timeline/onion-plan';
import { onionGhost } from './onion-ghost';
import { targetArtwork } from './target-artwork';

const paintOnion = (ctx: CanvasRenderingContext2D): void => {
  const target = currentTarget();
  const { onion, playMode, playing } = useTimelineStore.getState();
  const artwork = targetArtwork(target);
  const focus = currentFocus();
  if (!target?.animation || !artwork || !focus || (playing && onion.hideWhilePlaying) || useViewStore.getState().hideOverlays) return;
  const { animation, frame } = target.animation;
  const plan = onionPlan(animation, frame.id, currentPlan(focus), { onion, mode: playMode });
  if (plan.length === 0) return;
  const origin = canvasOrigin(artwork, animation, frame);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (const layer of plan) {
    ctx.globalAlpha = layer.alpha;
    ctx.drawImage(onionGhost(ctx.canvas, artwork, { ...target, animation: target.animation }, onionGhostOf(layer, onion)), origin.x, origin.y);
  }
  ctx.restore();
};

export { paintOnion };
