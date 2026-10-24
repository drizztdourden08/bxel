/* @layer core @kind types */
import type { ProjectId } from '../ids/id.type';
import type { AccessLevel } from '../manifest/manifest.type';

type ProjectGrant = {
  readonly projectId: ProjectId;
  readonly rootRealPath: string;
  readonly access: AccessLevel;
  readonly grantedAt: string;
};

type EffectiveGrant = {
  readonly access: AccessLevel;
  readonly turnItOnHere: boolean;
};

export type { EffectiveGrant, ProjectGrant };
