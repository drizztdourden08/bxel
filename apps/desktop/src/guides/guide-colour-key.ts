/* @layer renderer-app @kind logic */
import type { GuideAxis } from './guide.type';

const guideColourKey = (axis: GuideAxis, position: number): string => `${axis}:${position}`;

export { guideColourKey };
