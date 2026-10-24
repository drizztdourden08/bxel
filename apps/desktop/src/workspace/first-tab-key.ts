/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { ASSETS_OF, TAB_KINDS } from './workspace.constants';

const firstTabKey = (artwork: Artwork): AssetKey | null => {
  for (const kind of TAB_KINDS) {
    const first = ASSETS_OF[kind](artwork)[0];
    if (first) return { kind, id: first.id };
  }
  return null;
};

export { firstTabKey };
