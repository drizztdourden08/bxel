/* @layer core @kind logic */
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { MAX_SWATCH_SETS } from './swatch.constants';
import { swatchSetSchema } from './swatch-set-schema';
import type { SwatchSet } from './swatch.type';

const upsertSwatchSet = (sets: readonly SwatchSet[], set: SwatchSet): ProjectResult<readonly SwatchSet[]> => {
  const checked = swatchSetSchema.safeParse(set);
  if (!checked.success) {
    const issues = checked.error.issues.map((issue) => ({ path: issue.path.map(String).join('.'), message: issue.message }));
    return projectFail(PROJECT_ERROR_CODE.SWATCH_SET_INVALID, 'The swatch set breaks the set rules.', issues);
  }
  const exists = sets.some((each) => each.setId === checked.data.setId);
  if (!exists && sets.length >= MAX_SWATCH_SETS) {
    return projectFail(PROJECT_ERROR_CODE.TOO_MANY_SWATCH_SETS, `A list holds up to ${MAX_SWATCH_SETS} swatch sets.`);
  }
  const next = exists ? sets.map((each) => (each.setId === checked.data.setId ? checked.data : each)) : [...sets, checked.data];
  return projectOk(next);
};

export { upsertSwatchSet };
