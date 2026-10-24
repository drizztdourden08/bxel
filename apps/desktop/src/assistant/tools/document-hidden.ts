/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { assetKeys } from '../../workspace/asset-keys';

const documentHidden = (artwork: Artwork, hidden: ReadonlySet<string>): boolean => {
  if (hidden.size === 0) return false;
  const keys = assetKeys(artwork);
  return keys.length > 0 && keys.every((key) => hidden.has(key.id));
};

export { documentHidden };
