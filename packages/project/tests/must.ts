/* @layer tests @kind test */
import type { ProjectResult } from '@bxel/project';

const must = <T>(result: ProjectResult<T>): T => {
  if (!result.ok) throw new Error(result.message);
  return result.value;
};

export { must };
