/* @layer renderer-app @kind logic */
import type { SwatchCornerMarks } from '@drizztdourden08/tessera';
import { MARK_CORNERS } from '../PalettePanel.constants';

const cornerMarks = (marks: readonly number[]): SwatchCornerMarks =>
  Object.fromEntries(marks.flatMap((mark) => {
    const corner = MARK_CORNERS[mark];
    return corner === undefined ? [] : [[corner, mark]];
  }));

export { cornerMarks };
