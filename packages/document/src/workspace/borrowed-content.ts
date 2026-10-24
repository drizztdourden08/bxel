/* @layer core @kind logic */
import type { AssetContent, AssetSlice } from '../model/asset.type';
import { CONTENT_KEYS, OWNED_KEYS } from './owned-keys.constants';
import { pickContent } from './pick-content';

const borrowedContent = (slice: AssetSlice): AssetContent =>
  pickContent(
    slice.artwork,
    CONTENT_KEYS.filter((key) => !OWNED_KEYS[slice.kind].includes(key)),
  );

export { borrowedContent };
