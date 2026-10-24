/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import type { DocumentView } from '../../documents/document-host.type';
import { assetName } from '../../workspace/asset-name';

const wireAsset = (view: DocumentView | null, key: AssetKey | null): { readonly kind: string; readonly id: string; readonly name: string | null } | null =>
  key ? { kind: key.kind, id: key.id, name: view ? assetName(view.state.artwork, key) : null } : null;

export { wireAsset };
