/* @layer renderer-app @kind hook */
import { useEffect, useMemo } from 'react';
import { watchRoots } from '../asset-list/watch-roots';
import { fileKit } from '../files/file-kit';
import type { OpenProject } from '../project/project.type';
import { useHealthStore } from '../stores/useHealthStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { refreshHealth } from './refresh-health';
import type { HealthState } from './project-health.type';

const useHealthWatch = (project: OpenProject | null): HealthState => {
  const state = useHealthStore((each) => each.state);
  const roots = useMemo(() => project?.folders.filter((folder) => folder.granted).map((folder) => folder.path) ?? [], [project]);
  const key = roots.join('|');
  const dirty = useWorkspaceStore((each) => Object.values(each.workspaces).find((one) => one.kind === 'project')?.dirty);

  useEffect(() => {
    const kit = fileKit();
    if (!kit || key === '') return undefined;
    return watchRoots(kit.documents, key.split('|'), () => void refreshHealth());
  }, [key]);

  useEffect(() => {
    if (key !== '') void refreshHealth();
  }, [key, dirty?.size]);

  return state;
};

export { useHealthWatch };
