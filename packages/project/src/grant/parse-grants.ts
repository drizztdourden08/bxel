/* @layer core @kind logic */
import { isSamePath } from '../paths/is-same-path';
import { MAX_GRANTS } from './grant.constants';
import { grantSchema } from './grant-schema';
import type { ProjectGrant } from './grant.type';

const parseGrants = (value: unknown): readonly ProjectGrant[] => {
  if (!Array.isArray(value)) return [];
  const kept: ProjectGrant[] = [];
  for (const entry of value as unknown[]) {
    const parsed = grantSchema.safeParse(entry);
    if (!parsed.success || parsed.data.access === 'off') continue;
    const grant = parsed.data;
    const twin = kept.some((each) => each.projectId === grant.projectId && isSamePath(each.rootRealPath, grant.rootRealPath));
    if (!twin) kept.push(grant);
  }
  return kept.slice(0, MAX_GRANTS);
};

export { parseGrants };
