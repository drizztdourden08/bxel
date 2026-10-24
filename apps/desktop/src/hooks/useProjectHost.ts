/* @layer renderer-app @kind hook */
import { parseGrants, parseRecentProjects } from '@bxel/project';
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { syncProjectSets } from '../project/sync-project-sets';
import type { AppSettings } from '../settings.type';
import { useProjectStore } from '../stores/useProjectStore';

const useProjectHost = (): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const latest = useRef(settings);
  useEffect(() => {
    latest.current = settings;
  }, [settings]);
  useEffect(() => {
    useProjectStore.getState().setPort({
      read: () => ({
        projectRecents: parseRecentProjects(latest.current.projectRecents),
        assistantProjects: parseGrants(latest.current.assistantProjects),
      }),
      patch,
    });
    return () => useProjectStore.getState().setPort(null);
  }, [patch]);
  useEffect(() => {
    useProjectStore.getState().setRecents(parseRecentProjects(settings.projectRecents));
  }, [settings.projectRecents]);
  useEffect(syncProjectSets, []);
};

export { useProjectHost };
