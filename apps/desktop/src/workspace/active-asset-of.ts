/* @layer renderer-app @kind logic */
import type { DocumentView } from '../documents/document-host.type';
import { assetFileName } from './asset-file-name';
import { keyId } from './key-id';
import type { ActiveAsset, OpenTab, Workspace } from './workspace.type';

const activeAssetOf = (view: DocumentView, workspace: Workspace | undefined, tab: OpenTab | undefined): ActiveAsset => {
  if (!workspace || !tab) return { tab: null, name: view.state.artwork.name, path: undefined, dirty: !view.clean, anyDirty: !view.clean };
  const path = workspace.paths.get(tab.key.id) ?? (workspace.legacy?.path);
  const name = workspace.legacy === null ? assetFileName(workspace, view.state.artwork, tab.key) : (path?.split('/').at(-1) ?? workspace.name);
  return { tab, name, path, dirty: workspace.dirty.has(keyId(tab.key)), anyDirty: workspace.dirty.size > 0 };
};

export { activeAssetOf };
