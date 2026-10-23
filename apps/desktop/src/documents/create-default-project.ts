/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { DEFAULT_PROJECT } from './default-project.constants';
import type { DocumentHost } from './document-host.type';

const createDefaultProject = (host: DocumentHost): DocumentId => {
  const created = host.create(DEFAULT_PROJECT);
  if (!created.ok) throw new Error(created.error.message);
  return created.documentId;
};

export { createDefaultProject };
