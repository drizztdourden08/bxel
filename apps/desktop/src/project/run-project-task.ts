/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome, ProjectTask } from './project.type';

const attempt = async (task: ProjectTask, documents: DocumentsPort): Promise<ProjectOutcome | null> => {
  try {
    return await task(documents);
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
};

const runProjectTask = async (task: ProjectTask): Promise<ProjectOutcome | null> => {
  const kit = fileKit();
  return kit ? attempt(task, kit.documents) : { ok: false, message: PROJECT_TEXT.unavailable };
};

export { runProjectTask };
