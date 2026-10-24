/* @layer renderer-app @kind logic */
import { createFolderId, createProjectDocument, createProjectId, encodeProject } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { randomBytes } from '../swatch-library/random-bytes';
import { activateProject } from './activate-project';
import { findManifestFile } from './find-manifest-file';
import { makeSubfolders } from './make-subfolders';
import { PROJECT_FILE_SUFFIX, PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';

const createProject = async (name: string, folder: string): Promise<ProjectOutcome | null> => {
  const manifest = createProjectDocument({ projectId: createProjectId(randomBytes), folderId: createFolderId(randomBytes), name });
  const bytes = encodeProject({ manifest, preview: null, assets: new Map() }, () => Date.now());
  if (!bytes.ok) return { ok: false, message: bytes.message };
  const outcome = await runProjectTask(async (documents) => {
    if ((await findManifestFile(documents, folder)) !== null) return { ok: false, message: PROJECT_TEXT.hasManifest };
    await makeSubfolders(documents, folder, manifest);
    const projectFile = `${folder}/${name}${PROJECT_FILE_SUFFIX}`;
    await documents.write(projectFile, bytes.value, { recent: false });
    return activateProject(documents, folder, { manifest, projectFile, preview: null, migrated: false });
  });
  if (outcome?.ok) toast(PROJECT_TEXT.created(name), { variant: 'success' });
  return outcome;
};

export { createProject };
