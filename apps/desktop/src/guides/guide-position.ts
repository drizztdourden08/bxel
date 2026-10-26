/* @layer renderer-app @kind logic */
import type { GuideFrame, GuidePoint, GuideRequest } from './guide.type';
import { snapGuide } from './snap-guide';

const guidePosition = (handle: GuideFrame, request: GuideRequest, at: GuidePoint): number => {
  const origin = handle.pixelToScreen(0, 0);
  const { zoom } = handle.view();
  const along = request.axis === 'x' ? at.clientX - origin.x : at.clientY - origin.y;
  return snapGuide(along / Math.max(zoom, 0.01), request.length, request.whole);
};

export { guidePosition };
