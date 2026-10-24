/* @layer core @kind logic */
import type { AssetContent, AssetSlice } from '../model/asset.type';
import { OWNED_KEYS } from './owned-keys.constants';
import { pickContent } from './pick-content';

const ownedContent = (slice: AssetSlice): AssetContent => pickContent(slice.artwork, OWNED_KEYS[slice.kind]);

export { ownedContent };
