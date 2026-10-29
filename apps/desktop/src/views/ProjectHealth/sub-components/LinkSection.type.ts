/* @layer renderer-app @kind types */
import type { LinkFinding } from '../../../project-health/project-health.type';
import type { HealthActions } from '../ProjectHealth.type';

type LinkSectionProps = {
  readonly findings: readonly LinkFinding[];
  readonly actions: HealthActions;
  readonly title: string;
  readonly hint: string;
  readonly moved: boolean;
};

export type { LinkSectionProps };
