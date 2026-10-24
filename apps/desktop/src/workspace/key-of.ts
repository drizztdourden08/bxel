/* @layer renderer-app @kind logic */
import { ASSET_KIND } from '@bxel/document';
import type { AssetKey, AssetKind } from '@bxel/document';
import { KEY_SEPARATOR } from './workspace.constants';

const isKind = (value: string): value is AssetKind => Object.values<string>(ASSET_KIND).includes(value);

const keyOf = (id: string): AssetKey | null => {
  const at = id.indexOf(KEY_SEPARATOR);
  const kind = id.slice(0, at);
  return at > 0 && isKind(kind) ? { kind, id: id.slice(at + 1) } : null;
};

export { keyOf };
