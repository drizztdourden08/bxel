/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { OpenProject } from '../project/project.type';
import { buildLinkIndex } from './build-link-index';
import type { LinkIndex } from './link-index.type';
import { readAssetFiles } from './read-asset-files';
import { scanProjectFiles } from './scan-project-files';

/** The link index of the project as the files on disk hold it. Files the project does not show to the caller are not passed in. */
const scanLinkIndex = async (documents: DocumentsPort, project: OpenProject): Promise<LinkIndex> => {
  const paths = await scanProjectFiles(documents, project);
  return buildLinkIndex(await readAssetFiles(documents, paths));
};

export { scanLinkIndex };
