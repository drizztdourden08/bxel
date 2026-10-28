/* @layer renderer-app @kind logic */
import { GUIDE_AXES, GUIDE_GRAB } from './guide.constants';
import type { GuideFrame, GuideHit, GuideLines, GuidePoint } from './guide.type';

const guideNear = (handle: GuideFrame, sprite: { width: number; height: number; guides?: GuideLines }, at: GuidePoint): GuideHit | null => {
  const { guides } = sprite;
  if (!guides) return null;
  const origin = handle.pixelToScreen(0, 0);
  const { zoom } = handle.view();
  for (const axis of GUIDE_AXES) {
    const across = axis === 'x' ? at.clientX - origin.x : at.clientY - origin.y;
    const along = axis === 'x' ? at.clientY - origin.y : at.clientX - origin.x;
    const extent = (axis === 'x' ? sprite.height : sprite.width) * zoom;
    if (along < -GUIDE_GRAB || along > extent + GUIDE_GRAB) continue;
    const position = guides[axis].find((each) => Math.abs(across - each * zoom) <= GUIDE_GRAB);
    if (position !== undefined) return { axis, position };
  }
  return null;
};

export { guideNear };
