/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { ProjectIdentity } from './project.type';

const sameProject = (first: ProjectIdentity, second: ProjectIdentity): boolean =>
  first.manifest.projectId === second.manifest.projectId && isSamePath(first.rootRealPath, second.rootRealPath);

export { sameProject };
