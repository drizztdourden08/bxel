/* @layer renderer-app @kind hook */
import { parseGrants, parseRecentProjects } from '@bxel/project';
import { useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useMemo } from 'react';
import { grantRows } from '../../../project/grant-rows';
import type { GrantRow } from '../../../project/project.type';
import { setProjectAccess } from '../../../project/set-project-access';
import type { AppSettings } from '../../../settings.type';
import { useProjectStore } from '../../../stores/useProjectStore';
import { isAccessLevel } from './is-access-level';
import type { AssistantProjectsModel } from '../AssistantProjects.type';

const useAssistantProjects = (): AssistantProjectsModel => {
  const { settings, patch } = useSettings<AppSettings>();
  const open = useProjectStore((state) => state.project);
  const grants = useMemo(() => parseGrants(settings.assistantProjects), [settings.assistantProjects]);
  const recents = useMemo(() => parseRecentProjects(settings.projectRecents), [settings.projectRecents]);
  const rows = useMemo(() => grantRows(recents, grants, open), [recents, grants, open]);

  const setAccess = useCallback(
    (row: GrantRow, value: string): void => {
      if (!isAccessLevel(value)) return;
      const port = { read: () => ({ projectRecents: recents, assistantProjects: grants }), patch };
      void setProjectAccess(port, { projectId: row.projectId, rootRealPath: row.rootRealPath }, value);
    },
    [grants, patch, recents],
  );
  return { rows, setAccess };
};

export { useAssistantProjects };
