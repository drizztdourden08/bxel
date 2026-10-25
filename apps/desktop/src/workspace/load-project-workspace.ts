/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { DocumentId } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import type { OpenProject } from '../project/project.type';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { isSamePath } from '@bxel/project';
import { attachWorkspace } from './attach-workspace';
import { closeWorkspace } from './close-workspace';
import { focusTab } from './focus-tab';
import { parseStoredTabs } from './parse-stored-tabs';
import { projectWorkspaceId } from './project-workspace-id';
import { projectSeed } from './project-seed';
import { readAssetFiles } from './read-asset-files';
import { restoreTabs } from './restore-tabs';
import { scanProjectFiles } from './scan-project-files';
import { MAX_WORKSPACE_ASSETS, WORKSPACE_TEXT } from './workspace.constants';

const tellLoaded = (total: number, skipped: number, rekeyed: number): void => {
  if (total > MAX_WORKSPACE_ASSETS) toast(WORKSPACE_TEXT.capped(total, MAX_WORKSPACE_ASSETS), { variant: 'warning' });
  if (skipped > 0) toast(WORKSPACE_TEXT.skipped(skipped), { variant: 'warning' });
  if (rekeyed > 0) toast(WORKSPACE_TEXT.rekeyed(rekeyed), { variant: 'info' });
};

const reuse = async (project: OpenProject): Promise<DocumentId | null | undefined> => {
  const existing = projectWorkspaceId();
  if (existing === null) return undefined;
  const store = useWorkspaceStore.getState();
  if (isSamePath(store.workspaces[existing]?.projectFile ?? '', project.projectFile)) {
    const tab = store.tabs.find((each) => each.documentId === existing);
    if (tab) focusTab(tab);
    return existing;
  }
  return (await closeWorkspace(existing)) ? undefined : null;
};

const loadProjectWorkspace = async (kit: FileKit, project: OpenProject): Promise<DocumentId | null> => {
  const reused = await reuse(project);
  if (reused !== undefined) return reused;
  const store = useWorkspaceStore.getState();
  const stored = parseStoredTabs(useProjectStore.getState().port?.read().projectTabs)[project.manifest.projectId];
  const found = await scanProjectFiles(kit.documents, project);
  const paths = found.slice(0, MAX_WORKSPACE_ASSETS);
  store.setLoading({ done: 0, total: paths.length });
  try {
    const files = await readAssetFiles(kit.documents, paths, (done, total) => store.setLoading({ done, total }));
    const { seed, merged } = projectSeed(project, files);
    const documentId = attachWorkspace(kit.host, seed);
    kit.paths.remember(documentId, seed.projectFile ?? project.projectFile);
    restoreTabs(documentId, stored);
    tellLoaded(found.length, paths.length - merged.loaded, merged.dirty.size);
    return documentId;
  } finally {
    store.setLoading(null);
  }
};

export { loadProjectWorkspace };
