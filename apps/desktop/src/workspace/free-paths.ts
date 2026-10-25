/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import type { AssetKey } from '@bxel/document';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { baseName } from '../files/base-name';
import { onDisk } from './on-disk';
import { parentOf } from './parent-of';
import { takenIn } from './taken-in';
import { uniquePath } from './unique-path';
import type { Workspace } from './workspace.type';

const freePaths = async (
  documents: DocumentsPort,
  workspace: Workspace,
  paths: Map<string, string>,
  request: { readonly keys: readonly AssetKey[]; readonly chosen: string | null },
): Promise<Map<string, string>> => {
  const { keys, chosen } = request;
  for (const key of keys) {
    const path = paths.get(key.id);
    if (path === undefined || key.id === chosen || key.kind === 'project' || onDisk(workspace, key)) continue;
    const taken = await takenIn(documents, parentOf(path));
    for (const [id, known] of paths) if (id !== key.id) taken.add(known.toLowerCase());
    paths.set(key.id, uniquePath(parentOf(path), baseName(path), ASSET_FORMAT[key.kind].extension, taken));
  }
  return paths;
};

export { freePaths };
