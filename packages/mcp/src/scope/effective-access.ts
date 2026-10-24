/* @layer core @kind logic */
import type { ProjectAccess, SessionAccess } from './scope.type';

const effectiveAccess = (session: SessionAccess, project: ProjectAccess): ProjectAccess => {
  if (project === 'off') return 'off';
  return session === 'read' ? 'read' : project;
};

export { effectiveAccess };
