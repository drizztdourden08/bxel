/* @layer renderer-app @kind logic */
import { resolveFolders } from '@bxel/project';
import type { ProjectGrant } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { grantedFolders } from './granted-folders';
import type { OpenProject } from './project.type';
import { regrantFolder } from './regrant-folder';
import { readProjectFolder } from './read-project-folder';

const loadHeld = async (documents: DocumentsPort, grant: ProjectGrant, root: string): Promise<OpenProject | null> => {
  const loaded = await readProjectFolder(documents, root);
  if (!loaded.ok || loaded.value.manifest.projectId !== grant.projectId) return null;
  const { manifest, projectFile, preview } = loaded.value;
  const resolved = resolveFolders(manifest.folders, root);
  if (!resolved.ok) return null;
  return { manifest, rootRealPath: root, projectFile, preview, folders: await grantedFolders(documents, root, resolved.value) };
};

const restoreHeldProject = async (documents: DocumentsPort, grant: ProjectGrant): Promise<OpenProject | null> => {
  const root = await regrantFolder(documents, grant.rootRealPath);
  if (root === null) return null;
  const held = await loadHeld(documents, grant, root).catch(() => null);
  if (held === null) await documents.revokeFolder(root).catch(() => false);
  return held;
};

export { restoreHeldProject };
