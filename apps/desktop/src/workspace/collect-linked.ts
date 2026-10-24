/* @layer renderer-app @kind logic */
import { resolveLinkPath } from '@bxel/document';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { readAssetFiles } from './read-asset-files';
import { toSlashes } from './to-slashes';
import { MAX_WORKSPACE_ASSETS } from './workspace.constants';
import type { AssetFile } from './workspace.type';

const collectLinked = async (documents: DocumentsPort, start: string): Promise<readonly AssetFile[]> => {
  const files: AssetFile[] = [];
  const seen = new Set<string>();
  const queue = [toSlashes(start)];
  for (let path = queue.shift(); path !== undefined && files.length < MAX_WORKSPACE_ASSETS; path = queue.shift()) {
    if (seen.has(path.toLowerCase())) continue;
    seen.add(path.toLowerCase());
    const [file] = await readAssetFiles(documents, [path]);
    if (!file) continue;
    files.push(file);
    queue.push(...file.manifest.links.map((link) => resolveLinkPath(file.path, link.path)));
  }
  return files;
};

export { collectLinked };
