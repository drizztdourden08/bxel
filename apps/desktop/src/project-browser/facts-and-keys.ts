/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import type { AssetRow } from '../asset-list/asset-list.type';
import { assetKeys } from '../workspace/asset-keys';
import { keyId } from '../workspace/key-id';
import type { OpenTab } from '../workspace/workspace.type';
import type { BrowserFacts, FactsAndKeys } from './project-browser.type';
import { NO_FACTS } from './project-browser.constants';
import { rowFacts } from './row-facts';

const factsAndKeys = (artwork: Artwork, rows: readonly AssetRow[], tabs: readonly OpenTab[]): FactsAndKeys => {
  const open = new Set(tabs.map((tab) => keyId(tab.key)));
  const held = new Map(assetKeys(artwork).map((key) => [key.id, key] as const));
  const facts = new Map<string, BrowserFacts>();
  const keys = new Map<string, AssetKey>();
  for (const row of rows) {
    const key = row.assetId === null ? undefined : held.get(row.assetId);
    if (key) keys.set(row.id, key);
    facts.set(row.id, key ? rowFacts(artwork, key, open.has(keyId(key))) : NO_FACTS);
  }
  return { facts, keys };
};

export { factsAndKeys };
