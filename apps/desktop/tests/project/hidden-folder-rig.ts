/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import { createFolderId } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { manifestOf } from './project-harness';
import { toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';
import type { Disk } from './memory-disk';

const SHARED = 'C:/Art/Shared';

const sharedManifest = (): ProjectDocument => {
  const owner = manifestOf();
  const rootFolder = owner.folders[0];
  if (!rootFolder) throw new Error('no root folder');
  const shared = { folderId: createFolderId((length) => Uint8Array.from({ length }, (_unused, index) => index + 9)), name: 'Shared', path: '../Shared' };
  return { ...owner, folders: [rootFolder, { ...rootFolder, ...shared, roles: {} }], assistant: { ...owner.assistant, folders: [rootFolder.folderId] } };
};

const workspaceDocumentId = (): DocumentId => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('the project workspace did not open');
  return workspace.documentId;
};

const openSharedRig = (seed: (disk: Disk) => void): Promise<ToolRig> => toolRig({ manifest: sharedManifest(), seed });

export { openSharedRig, SHARED, workspaceDocumentId };
