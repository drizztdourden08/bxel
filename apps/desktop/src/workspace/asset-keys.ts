/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { ASSETS_OF, SAVE_ORDER } from './workspace.constants';

const assetKeys = (artwork: Artwork): readonly AssetKey[] =>
  SAVE_ORDER.flatMap((kind) => ASSETS_OF[kind](artwork).map((asset) => ({ kind, id: asset.id })));

export { assetKeys };
