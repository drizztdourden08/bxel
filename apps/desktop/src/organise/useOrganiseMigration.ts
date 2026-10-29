/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { projectKey } from '../project-manager/project-key';
import { clearLegacyOrganise } from '../project-browser/clear-legacy-organise';
import { readLegacyOrganise } from '../project-browser/read-legacy-organise';
import type { OpenProject } from '../project/project.type';
import type { AppSettings } from '../settings.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { editOrganise } from './edit-organise';
import { opsFromSettings } from './ops-from-settings';

/** Moves the pins and smart filters of this project from the owner's settings into the project file, once the files are loaded. */
const useOrganiseMigration = (project: OpenProject | null): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const paths = useWorkspaceStore((state) => Object.values(state.workspaces).find((each) => each.kind === 'project')?.paths);
  const held = useRef(settings.projectBrowserViews);
  held.current = settings.projectBrowserViews;
  const running = useRef(false);
  const key = project === null ? null : projectKey(project.manifest.projectId, project.rootRealPath);

  useEffect(() => {
    if (key === null || paths === undefined || paths.size === 0 || running.current) return;
    const legacy = readLegacyOrganise(held.current, key);
    if (legacy.pinned.length === 0 && legacy.smart.length === 0) return;
    running.current = true;
    const ops = opsFromSettings(legacy, paths);
    void (async () => {
      for (const op of ops) await editOrganise(op);
      patch({ projectBrowserViews: clearLegacyOrganise(held.current, key) });
      running.current = false;
    })();
  }, [key, paths, patch]);
};

export { useOrganiseMigration };
