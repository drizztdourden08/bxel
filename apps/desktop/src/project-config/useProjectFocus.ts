/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { NO_PATHS } from '../asset-config/asset-config.constants';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import type { ProjectFocus } from './project-config.type';

const useProjectFocus = (): ProjectFocus | null => {
  const project = useProjectStore((state) => state.project);
  const documentId = useWorkspaceStore((state) => Object.values(state.workspaces).find((workspace) => workspace.kind === 'project')?.documentId ?? null);
  const artwork = useDocumentStore((state) => (documentId === null ? undefined : state.views[documentId]?.state.artwork));
  const paths = useWorkspaceStore((state) => (documentId === null ? undefined : state.workspaces[documentId]?.paths));
  return useMemo(() => (project ? { project, documentId, artwork, paths: paths ?? NO_PATHS } : null), [project, documentId, artwork, paths]);
};

export { useProjectFocus };
