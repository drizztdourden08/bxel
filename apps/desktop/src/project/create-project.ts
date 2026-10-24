/* @layer renderer-app @kind logic */
import { createFolderId, createManifest, createProjectId, manifestFileName, writeManifest } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { randomBytes } from '../swatch-library/random-bytes';
import { activateProject } from './activate-project';
import { findManifestFile } from './find-manifest-file';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';

const createProject = async (name: string, folder: string): Promise<ProjectOutcome | null> => {
  const manifest = createManifest({ projectId: createProjectId(randomBytes), folderId: createFolderId(randomBytes), name });
  const text = writeManifest(manifest);
  if (!text.ok) return { ok: false, message: text.message };
  const outcome = await runProjectTask(async (documents) => {
    if ((await findManifestFile(documents, folder)) !== null) return { ok: false, message: PROJECT_TEXT.hasManifest };
    const manifestPath = `${folder}/${manifestFileName(name)}`;
    await documents.writeText(manifestPath, text.value, { recent: false });
    return activateProject(documents, folder, { manifest, manifestPath });
  });
  if (outcome?.ok) toast(PROJECT_TEXT.created(name), { variant: 'success' });
  return outcome;
};

export { createProject };
