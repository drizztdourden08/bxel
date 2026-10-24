/* @layer core @kind logic */
import type { ProjectManifest } from '../manifest/manifest.type';
import { isSamePath } from '../paths/is-same-path';
import type { EffectiveGrant, ProjectGrant } from './grant.type';

const effectiveGrant = (
  manifest: Pick<ProjectManifest, 'projectId' | 'assistant'>,
  rootRealPath: string,
  grants: readonly ProjectGrant[],
): EffectiveGrant => {
  const match = grants.find(
    (grant) => grant.projectId === manifest.projectId && isSamePath(grant.rootRealPath, rootRealPath),
  );
  if (match) return { access: match.access, turnItOnHere: false };
  return { access: 'off', turnItOnHere: manifest.assistant.access !== 'off' };
};

export { effectiveGrant };
