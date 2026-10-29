/* @layer core @kind logic */
import { isOrganiseEmpty } from './is-organise-empty';
import { PROJECT_DOCUMENT_VERSION, PROJECT_ORGANISE_VERSION } from './project-document.constants';
import type { ProjectDocument } from './project-document.type';

const withOrganiseVersion = (manifest: ProjectDocument): ProjectDocument => {
  const { organise, ...rest } = manifest;
  const kept = organise !== undefined && !isOrganiseEmpty(organise);
  return kept ? { ...rest, formatVersion: PROJECT_ORGANISE_VERSION, organise } : { ...rest, formatVersion: PROJECT_DOCUMENT_VERSION };
};

export { withOrganiseVersion };
