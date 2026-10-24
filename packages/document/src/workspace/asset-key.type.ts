/* @layer core @kind types */
import type { AssetKind } from '../model/asset.type';

type AssetKey = { readonly kind: AssetKind; readonly id: string };

export type { AssetKey };
