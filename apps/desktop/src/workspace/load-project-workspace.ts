/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { DocumentId } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import type { OpenProject } from '../project/project.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { attachWorkspace } from './attach-workspace';
import { projectSeed } from './project-seed';
import { readAssetFiles } from './read-asset-files';
import { scanProjectFiles } from './scan-project-files';
import { MAX_WORKSPACE_ASSETS, WORKSPACE_TEXT } from './workspace.constants';

const tellLoaded = (total: number, skipped: number, rekeyed: number): void => {
  if (total > MAX_WORKSPACE_ASSETS) toast(WORKSPACE_TEXT.capped(total, MAX_WORKSPACE_ASSETS), { variant: 'warning' });
  if (skipped > 0) toast(WORKSPACE_TEXT.skipped(skipped), { variant: 'warning' });
  if (rekeyed > 0) toast(WORKSPACE_TEXT.rekeyed(rekeyed), { variant: 'info' });
};

const loadProjectWorkspace = async (kit: FileKit, project: OpenProject): Promise<DocumentId> => {
  const store = useWorkspaceStore.getState();
  const found = await scanProjectFiles(kit.documents, project);
  const paths = found.slice(0, MAX_WORKSPACE_ASSETS);
  store.setLoading({ done: 0, total: paths.length });
  try {
    const files = await readAssetFiles(kit.documents, paths, (done, total) => store.setLoading({ done, total }));
    const { seed, merged } = projectSeed(project, files);
    const documentId = attachWorkspace(kit.host, seed);
    kit.paths.remember(documentId, seed.projectFile ?? project.projectFile);
    const decoded = merged.paths.size;
    tellLoaded(found.length, paths.length - decoded, merged.dirty.size);
    return documentId;
  } finally {
    store.setLoading(null);
  }
};

export { loadProjectWorkspace };
