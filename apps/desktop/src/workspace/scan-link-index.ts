/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { OpenProject } from '../project/project.type';
import { buildLinkIndex } from './build-link-index';
import type { LinkIndex } from './link-index.type';
import { readAssetFiles } from './read-asset-files';
import { scanProjectFiles } from './scan-project-files';

const scanLinkIndex = async (documents: DocumentsPort, project: OpenProject): Promise<LinkIndex> => {
  const paths = await scanProjectFiles(documents, project);
  return buildLinkIndex(await readAssetFiles(documents, paths));
};

export { scanLinkIndex };
