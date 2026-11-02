/* @layer renderer-app @kind logic */
import { GUIDE_AXES } from './guide.constants';
import type { GuideLines, GuideRow } from './guide.type';

const guideRows = (lines: GuideLines | undefined): readonly GuideRow[] =>
  GUIDE_AXES.flatMap((axis) => (lines?.[axis] ?? []).map((position) => ({ axis, position })));

export { guideRows };
