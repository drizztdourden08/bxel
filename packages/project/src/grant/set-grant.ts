/* @layer core @kind logic */
import { isSamePath } from '../paths/is-same-path';
import { MAX_GRANTS } from './grant.constants';
import type { ProjectGrant } from './grant.type';

const sameProject = (first: ProjectGrant, second: ProjectGrant): boolean =>
  first.projectId === second.projectId && isSamePath(first.rootRealPath, second.rootRealPath);

const setGrant = (grants: readonly ProjectGrant[], grant: ProjectGrant): readonly ProjectGrant[] => {
  const others = grants.filter((each) => !sameProject(each, grant));
  if (grant.access === 'off') return others;
  return [...others, grant].slice(-MAX_GRANTS);
};

export { setGrant };
