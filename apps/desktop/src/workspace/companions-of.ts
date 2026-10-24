/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { assetName } from './asset-name';
import { linkedKeys } from './linked-keys';
import { keyId } from './key-id';
import { onDisk } from './on-disk';
import type { Workspace } from './workspace.type';

const companionsOf = (workspace: Workspace, artwork: Artwork, key: AssetKey): readonly AssetKey[] => {
  const needed = (linked: AssetKey): boolean =>
    !onDisk(workspace, linked) || (linked.kind === 'palette' && workspace.dirty.has(keyId(linked)));
  const extra = linkedKeys(artwork, key).filter(
    (linked) => workspace.paths.has(linked.id) && assetName(artwork, linked) !== null && needed(linked),
  );
  return [key, ...extra];
};

export { companionsOf };
