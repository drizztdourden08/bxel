/* @layer renderer-app @kind logic */
import { comparablePath } from '@bxel/project';

const projectKey = (projectId: string, root: string): string => `${projectId}|${comparablePath(root) ?? root}`;

export { projectKey };
