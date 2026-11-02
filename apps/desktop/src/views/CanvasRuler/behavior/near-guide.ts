/* @layer renderer-app @kind logic */
import { guideScope } from '../../../guides/guide-scope';
import type { GuideAxis } from '../../../guides/guide.type';
import { nearestLine } from '../../../guides/nearest-line';

const nearGuide = ({ axis, position, zoom }: { axis: GuideAxis; position: number; zoom: number }): number | null => {
  const lines = guideScope()?.lines();
  return nearestLine(position, lines ? lines[axis] : [], zoom);
};

export { nearGuide };
