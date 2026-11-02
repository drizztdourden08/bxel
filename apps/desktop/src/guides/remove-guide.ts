/* @layer renderer-app @kind logic */
import { guideScope } from './guide-scope';
import type { GuideRow } from './guide.type';

const removeGuide = ({ axis, position }: GuideRow): void => guideScope()?.remove(axis, position);

export { removeGuide };
