/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { ASSETS_OF } from './workspace.constants';

const assetName = (artwork: Artwork, key: AssetKey): string | null =>
  ASSETS_OF[key.kind](artwork).find((asset) => asset.id === key.id)?.name ?? null;

export { assetName };
