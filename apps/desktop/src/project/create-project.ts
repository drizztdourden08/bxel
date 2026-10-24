/* @layer renderer-app @kind logic */
import { createFolderId, createManifest, createProjectId, manifestFileName, writeManifest } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { randomBytes } from '../swatch-library/random-bytes';
import { activateProject } from './activate-project';
import { findManifestFile } from './find-manifest-file';
import { makeSubfolders } from './make-subfolders';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';
import { withSubfolders } from './with-subfolders';

const createProject = async (name: string, folder: string): Promise<ProjectOutcome | null> => {
  const seed = createManifest({ projectId: createProjectId(randomBytes), folderId: createFolderId(randomBytes), name });
  const manifest = withSubfolders(seed);
  const text = writeManifest(manifest);
  if (!text.ok) return { ok: false, message: text.message };
  const outcome = await runProjectTask(async (documents) => {
    if ((await findManifestFile(documents, folder)) !== null) return { ok: false, message: PROJECT_TEXT.hasManifest };
    await makeSubfolders(documents, folder);
    const manifestPath = `${folder}/${manifestFileName(name)}`;
    await documents.writeText(manifestPath, text.value, { recent: false });
    return activateProject(documents, folder, { manifest, manifestPath });
  });
  if (outcome?.ok) toast(PROJECT_TEXT.created(name), { variant: 'success' });
  return outcome;
};

export { createProject };
