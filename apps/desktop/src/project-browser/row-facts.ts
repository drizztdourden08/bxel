/* @layer renderer-app @kind logic */
import { findAnimation, findBank, findSheet, findSprite, findTilemap, findTileset, sheetExtent, sheetSizes } from '@bxel/document';
import type { AnimationId, Artwork, AssetKey, BankId, SheetId, SpriteId, TilemapId, TilesetId } from '@bxel/document';
import { assetName } from '../workspace/asset-name';
import { linkedKeys } from '../workspace/linked-keys';
import { referrersOf } from '../workspace/referrers-of';
import { NO_FACTS } from './project-browser.constants';
import type { BrowserFacts, Measure } from './project-browser.type';

const bankFacts = (artwork: Artwork, id: BankId): Pick<Measure, 'palette' | 'colours'> => {
  const bank = findBank(artwork, id);
  return { palette: bank?.name ?? null, colours: bank?.slots.length ?? null };
};

const measureSprite = (artwork: Artwork, id: string): Measure => {
  const sprite = findSprite(artwork, id as SpriteId);
  return sprite ? { width: sprite.width, height: sprite.height, frames: sprite.frames.length, ...bankFacts(artwork, sprite.bankId) } : NO_FACTS;
};

const measureAnimation = (artwork: Artwork, id: string): Measure => {
  const animation = findAnimation(artwork, id as AnimationId);
  return animation ? { width: animation.width, height: animation.height, frames: animation.frames.length, ...bankFacts(artwork, animation.bankId) } : NO_FACTS;
};

const measureSheet = (artwork: Artwork, id: string): Measure => {
  const sheet = findSheet(artwork, id as SheetId);
  if (!sheet) return NO_FACTS;
  const extent = sheetExtent(sheet, sheetSizes(artwork), artwork.animations);
  return { ...NO_FACTS, width: extent.width, height: extent.height };
};

const measureTileset = (artwork: Artwork, id: string): Measure => {
  const tileset = findTileset(artwork, id as TilesetId);
  return tileset ? { width: tileset.tileWidth, height: tileset.tileHeight, frames: null, ...bankFacts(artwork, tileset.bankId) } : NO_FACTS;
};

const measureTilemap = (artwork: Artwork, id: string): Measure => {
  const tilemap = findTilemap(artwork, id as TilemapId);
  return tilemap ? { ...NO_FACTS, width: tilemap.columns, height: tilemap.rows } : NO_FACTS;
};

const measureBank = (artwork: Artwork, id: string): Measure => ({ ...NO_FACTS, ...bankFacts(artwork, id as BankId) });

const measureOf = (artwork: Artwork, key: AssetKey): Measure => {
  if (key.kind === 'sprite') return measureSprite(artwork, key.id);
  if (key.kind === 'animation') return measureAnimation(artwork, key.id);
  if (key.kind === 'sheet') return measureSheet(artwork, key.id);
  if (key.kind === 'tileset') return measureTileset(artwork, key.id);
  if (key.kind === 'tilemap') return measureTilemap(artwork, key.id);
  return key.kind === 'palette' ? measureBank(artwork, key.id) : NO_FACTS;
};

const namesOf = (artwork: Artwork, keys: readonly AssetKey[]): readonly string[] =>
  keys.flatMap((key) => {
    const name = assetName(artwork, key);
    return name === null ? [] : [name];
  });

const rowFacts = (artwork: Artwork, key: AssetKey, open: boolean): BrowserFacts => ({
  ...measureOf(artwork, key),
  uses: namesOf(artwork, linkedKeys(artwork, key)),
  usedBy: namesOf(artwork, referrersOf(artwork, key)),
  open,
});

export { rowFacts };
