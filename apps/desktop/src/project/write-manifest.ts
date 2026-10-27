/* @layer renderer-app @kind logic */
import { encodeProject } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import { reasonOf } from '../files/reason-of';
import type { FileKit } from '../files/files.type';
import { useProjectStore } from '../stores/useProjectStore';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';

const writeManifest = async (kit: Pick<FileKit, 'documents' | 'clock'>, next: ProjectDocument): Promise<ProjectOutcome> => {
  const { project, update } = useProjectStore.getState();
  if (!project) return { ok: false, message: PROJECT_TEXT.unavailable };
  const bytes = encodeProject({ manifest: next, preview: project.preview, assets: new Map() }, kit.clock);
  if (!bytes.ok) return { ok: false, message: PROJECT_TEXT.saveFailed(bytes.message) };
  update(next);
  try {
    await kit.documents.write(project.projectFile, bytes.value, { recent: false });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: PROJECT_TEXT.saveFailed(reasonOf(error)) };
  }
};

export { writeManifest };
