/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import { keyId } from './key-id';
import type { Workspace } from './workspace.type';

const pathsForLinks = (workspace: Workspace, key: AssetKey, paths: ReadonlyMap<string, string>): ReadonlyMap<string, string> => {
  const dropped = workspace.unlinked.get(keyId(key));
  return dropped === undefined ? paths : new Map([...paths].filter(([id]) => !dropped.has(id)));
};

export { pathsForLinks };
