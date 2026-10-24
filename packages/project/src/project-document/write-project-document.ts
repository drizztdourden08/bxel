/* @layer core @kind logic */
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { manifestFailure } from '../manifest/manifest-failure';
import { projectDocumentSchema } from './project-document-schema';
import type { ProjectDocument } from './project-document.type';
import { orderProjectDocument } from './order-project-document';

const writeProjectDocument = (manifest: ProjectDocument): ProjectResult<string> => {
  const checked = projectDocumentSchema.safeParse(manifest);
  if (!checked.success) return manifestFailure(checked.error);
  return projectOk(`${JSON.stringify(orderProjectDocument(checked.data as ProjectDocument), null, 2)}\n`);
};

export { writeProjectDocument };
