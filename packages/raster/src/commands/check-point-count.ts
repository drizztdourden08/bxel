/* @layer core @kind logic */
import { ERROR_CODE, MAX_POINTS, fail } from '@bxel/document';

const checkPointCount = (count: number, step: number): void => {
  if (count > MAX_POINTS) {
    throw fail(ERROR_CODE.BATCH_TOO_LARGE, `A stroke holds at most ${MAX_POINTS} points.`, {
      path: `steps.${step}.options.points`,
    });
  }
};

export { checkPointCount };
