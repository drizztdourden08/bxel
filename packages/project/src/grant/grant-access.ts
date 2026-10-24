/* @layer core @kind logic */
import type { ProjectId } from '../ids/id.type';
import type { AccessLevel } from '../manifest/manifest.type';
import { isSamePath } from '../paths/is-same-path';
import type { ProjectGrant } from './grant.type';

const grantAccess = (grants: readonly ProjectGrant[], projectId: ProjectId, rootRealPath: string): AccessLevel =>
  grants.find((grant) => grant.projectId === projectId && isSamePath(grant.rootRealPath, rootRealPath))?.access ?? 'off';

export { grantAccess };
