/* @layer core @kind types */
import type { ProjectId } from '../ids/id.type';

type RecentProject = {
  readonly projectId: ProjectId;
  readonly name: string;
  readonly rootRealPath: string;
  readonly openedAt: string;
};

export type { RecentProject };
