/* @layer core @kind logic */
import { ACCESS_SECTION_KEY } from '../manifest/access-section.constants';
import type { ProjectManifest } from '../manifest/manifest.type';
import { isSamePath } from '../paths/is-same-path';
import type { EffectiveGrant, ProjectGrant } from './grant.type';

const effectiveGrant = (
  manifest: Pick<ProjectManifest, 'projectId' | typeof ACCESS_SECTION_KEY>,
  rootRealPath: string,
  grants: readonly ProjectGrant[],
): EffectiveGrant => {
  const match = grants.find(
    (grant) => grant.projectId === manifest.projectId && isSamePath(grant.rootRealPath, rootRealPath),
  );
  if (match) return { access: match.access, turnItOnHere: false };
  return { access: 'off', turnItOnHere: manifest[ACCESS_SECTION_KEY].access !== 'off' };
};

export { effectiveGrant };
