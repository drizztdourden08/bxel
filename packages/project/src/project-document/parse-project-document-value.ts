/* @layer core @kind logic */
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { manifestFailure } from '../manifest/manifest-failure';
import { projectDocumentSchema } from './project-document-schema';
import type { ProjectDocument } from './project-document.type';

const parseProjectDocumentValue = (value: unknown): ProjectResult<ProjectDocument> => {
  const parsed = projectDocumentSchema.safeParse(value);
  return parsed.success ? projectOk(parsed.data as ProjectDocument) : manifestFailure(parsed.error);
};

export { parseProjectDocumentValue };
