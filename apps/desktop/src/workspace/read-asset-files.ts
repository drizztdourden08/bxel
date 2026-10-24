/* @layer renderer-app @kind logic */
import { readAssetManifest } from '@bxel/document/native';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toSlashes } from './to-slashes';
import type { AssetFile, Progress } from './workspace.type';

const readOne = async (documents: DocumentsPort, path: string): Promise<AssetFile | null> => {
  const bytes = await documents.read(path).catch(() => null);
  const manifest = bytes === null ? null : readAssetManifest(bytes);
  return bytes === null || manifest === null ? null : { path: toSlashes(path), bytes, manifest };
};

const readAssetFiles = async (documents: DocumentsPort, paths: readonly string[], progress?: Progress): Promise<readonly AssetFile[]> => {
  const files: AssetFile[] = [];
  for (const [index, path] of paths.entries()) {
    const file = await readOne(documents, path);
    if (file) files.push(file);
    progress?.(index + 1, paths.length);
  }
  return files;
};

export { readAssetFiles };
