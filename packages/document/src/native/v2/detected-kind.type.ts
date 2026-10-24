/* @layer core @kind types */
import type { AssetKind } from '../../model/asset.type';

type DetectedKind = AssetKind | 'legacy';

type AssetDetection = { readonly kind: DetectedKind; readonly extensionMatches: boolean | null };

export type { AssetDetection, DetectedKind };
