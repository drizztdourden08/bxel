/* @layer renderer-app @kind types */
import type { HealthCheck } from '../../project-health/project-health.type';
import type { ProjectLocation } from './tool-input.type';

type Finding = {
  check: HealthCheck;
  fix: string;
  message: string;
  file: ProjectLocation | null;
  linkId?: string;
  foundAt?: ProjectLocation | null;
  expectedFolder?: ProjectLocation | null;
  sharedWith?: ProjectLocation[];
};

export type { Finding };
