/* @layer renderer-app @kind logic */
import { currentGuideColours } from '../../../guides/current-guide-colours';
import { guideColourKey } from '../../../guides/guide-colour-key';
import { guideScope } from '../../../guides/guide-scope';
import { useGuideStore } from '../../../stores/useGuideStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelView } from '../../PixelViewport';
import { GUIDE_ALPHA } from '../EditorCanvas.constants';
import { shownGuides } from './shown-guides';
import { strokeGuide } from './stroke-guide';

const paintGuides = (ctx: CanvasRenderingContext2D, view: PixelView): void => {
  const lines = guideScope()?.lines();
  const drag = useGuideStore.getState().drag;
  if (!useViewStore.getState().guides && !drag) return;
  const { x, y } = shownGuides(lines, drag);
  if (x.length + y.length === 0) return;
  ctx.save();
  const { guideColour, guideColourY } = useViewStore.getState();
  const own = currentGuideColours();
  ctx.globalAlpha = GUIDE_ALPHA;
  ctx.lineWidth = 1 / view.zoom;
  for (const at of x) strokeGuide(ctx, { from: [at, 0], to: [at, view.imageHeight], colour: own[guideColourKey('x', at)] ?? guideColour });
  for (const at of y) strokeGuide(ctx, { from: [0, at], to: [view.imageWidth, at], colour: own[guideColourKey('y', at)] ?? guideColourY });
  ctx.restore();
};

export { paintGuides };
