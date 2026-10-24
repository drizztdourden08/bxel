/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { ASSETS_OF } from './workspace.constants';

const assetCreated = (artwork: Artwork, key: AssetKey): number | null =>
  ASSETS_OF[key.kind](artwork).find((asset) => asset.id === key.id)?.created ?? null;

export { assetCreated };
