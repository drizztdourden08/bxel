/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import { assetName } from './asset-name';
import { keyId } from './key-id';
import type { Workspace } from './workspace.type';

const onDisk = (workspace: Workspace, key: AssetKey): boolean =>
  workspace.saved.has(keyId(key)) || (workspace.paths.has(key.id) && assetName(workspace.base, key) !== null);

export { onDisk };
