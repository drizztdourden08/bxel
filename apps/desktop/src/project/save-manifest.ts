/* @layer renderer-app @kind logic */
import { writeManifest } from '@bxel/project';
import type { ProjectManifest } from '@bxel/project';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { useProjectStore } from '../stores/useProjectStore';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';

const saveManifest = async (next: ProjectManifest): Promise<ProjectOutcome> => {
  const { project, update } = useProjectStore.getState();
  const kit = fileKit();
  if (!project || !kit) return { ok: false, message: PROJECT_TEXT.unavailable };
  const text = writeManifest(next);
  if (!text.ok) return { ok: false, message: PROJECT_TEXT.saveFailed(text.message) };
  update(next);
  try {
    await kit.documents.writeText(project.manifestPath, text.value, { recent: false });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: PROJECT_TEXT.saveFailed(reasonOf(error)) };
  }
};

export { saveManifest };
