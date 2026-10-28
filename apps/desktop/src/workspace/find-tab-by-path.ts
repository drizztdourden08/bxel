/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { DocumentView } from '../documents/document-host.type';
import { assetKeys } from './asset-keys';
import { tabOf } from './tab-of';
import { toSlashes } from './to-slashes';
import type { OpenTab, Workspace } from './workspace.type';

const findTabByPath = (workspaces: Readonly<Record<string, Workspace>>, views: Readonly<Record<string, DocumentView>>, path: string): OpenTab | null => {
  const wanted = toSlashes(path);
  for (const workspace of Object.values(workspaces)) {
    const artwork = views[workspace.documentId]?.state.artwork;
    const id = [...workspace.paths].find(([, known]) => isSamePath(known, wanted))?.[0];
    const key = artwork && id !== undefined ? assetKeys(artwork).find((each) => each.id === id) : undefined;
    if (key) return tabOf(workspace.documentId, key);
  }
  return null;
};

export { findTabByPath };
