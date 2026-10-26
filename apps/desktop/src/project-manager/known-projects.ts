/* @layer renderer-app @kind logic */
import type { RecentProject } from '@bxel/project';
import type { OpenProject } from '../project/project.type';
import type { KnownProject, KnownSource } from './project-manager.type';
import { projectKey } from './project-key';

const known = (source: KnownSource, openKey: string | null): KnownProject => {
  const key = projectKey(source.projectId, source.rootRealPath);
  return { key, ...source, open: key === openKey };
};

const fromHeld = (project: OpenProject): KnownSource => ({
  projectId: project.manifest.projectId,
  name: project.manifest.name,
  rootRealPath: project.rootRealPath,
  openedAt: '',
});

const knownProjects = (recents: readonly RecentProject[], held: readonly OpenProject[], open: OpenProject | null): readonly KnownProject[] => {
  const openKey = open === null ? null : projectKey(open.manifest.projectId, open.rootRealPath);
  const sources: KnownSource[] = [...recents, ...held.map(fromHeld), ...(open === null ? [] : [fromHeld(open)])];
  const seen = new Set<string>();
  const found: KnownProject[] = [];
  for (const source of sources) {
    const entry = known(source, openKey);
    if (seen.has(entry.key)) continue;
    seen.add(entry.key);
    found.push(entry.open && open !== null ? { ...entry, name: open.manifest.name } : entry);
  }
  return found;
};

export { knownProjects };
