/* @layer renderer-app @kind logic */
import type { ProjectDocument } from '@bxel/project';
import { fileKit } from '../files/file-kit';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';
import { writeManifest } from './write-manifest';

const saveManifest = async (next: ProjectDocument): Promise<ProjectOutcome> => {
  const kit = fileKit();
  return kit ? writeManifest(kit, next) : { ok: false, message: PROJECT_TEXT.unavailable };
};

export { saveManifest };
