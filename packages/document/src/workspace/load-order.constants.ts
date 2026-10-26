/* @layer core @kind config */
import type { AssetKind } from '../model/asset.type';

const ASSET_LOAD_ORDER: readonly (readonly AssetKind[])[] = [
  ['palette'],
  ['sprite'],
  ['animation'],
  ['tileset'],
  ['sheet'],
  ['tilemap'],
];

export { ASSET_LOAD_ORDER };
