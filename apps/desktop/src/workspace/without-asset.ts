/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { CONTENT_OF_KIND } from './workspace.constants';

type Identified = { readonly id: string };

const withoutAsset = (artwork: Artwork, key: AssetKey): Artwork => {
  const field = CONTENT_OF_KIND[key.kind];
  if (field === undefined) return artwork;
  const kept = (artwork[field] as readonly Identified[]).filter((each) => each.id !== key.id);
  return { ...artwork, [field]: kept };
};

export { withoutAsset };
