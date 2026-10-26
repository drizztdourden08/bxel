/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import type { GuideAxis } from './guide.type';

const guideLength = (axis: GuideAxis, size: Size): number => (axis === 'x' ? size.width : size.height);

export { guideLength };
