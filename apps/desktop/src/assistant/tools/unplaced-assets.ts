/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { assetName } from '../../workspace/asset-name';
import { keyId } from '../../workspace/key-id';
import { linkedKeys } from '../../workspace/linked-keys';
import type { Workspace } from '../../workspace/workspace.type';

type Search = { readonly workspace: Workspace; readonly artwork: Artwork; readonly hidden: ReadonlySet<string>; readonly named: ReadonlySet<string> };

const wantsFile = ({ workspace, artwork, hidden, named }: Search, key: AssetKey): boolean =>
  key.kind !== 'project' &&
  (key.kind !== 'palette' || named.has(keyId(key))) &&
  !workspace.paths.has(key.id) &&
  !hidden.has(key.id) &&
  assetName(artwork, key) !== null;

const unplacedAssets = (search: Omit<Search, 'named'>, roots: readonly AssetKey[], named: readonly AssetKey[] = []): readonly AssetKey[] => {
  const full = { ...search, named: new Set(named.map(keyId)) };
  const seen = new Set<string>();
  const found: AssetKey[] = [];
  const queue = [...roots];
  for (let key = queue.shift(); key !== undefined; key = queue.shift()) {
    if (seen.has(keyId(key))) continue;
    seen.add(keyId(key));
    if (wantsFile(full, key)) found.push(key);
    queue.push(...linkedKeys(search.artwork, key));
  }
  return found;
};

export { unplacedAssets };
