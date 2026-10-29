/* @layer renderer-app @kind types */
import type { AssetKind } from '@bxel/document';
import type { IndexedFile } from '../../workspace/link-index.type';

type AssetFile = IndexedFile & { readonly kind: Exclude<AssetKind, 'project'> };

export type { AssetFile };
