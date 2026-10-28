/* @layer renderer-app @kind logic */
import { findAnimation, findBank, findSheet, findSprite, findTilemap, findTileset, sheetExtent, sheetSizes } from '@bxel/document';
import type { AnimationId, Artwork, AssetKey, BankId, SheetId, SpriteId, TilemapId, TilesetId } from '@bxel/document';
import { assetName } from '../workspace/asset-name';
import { linkedKeys } from '../workspace/linked-keys';
import { referrersOf } from '../workspace/referrers-of';
import type { BrowserFacts } from './project-browser.type';

const NO_FACTS: BrowserFacts = { width: null, height: null, frames: null, palette: null, colours: null, uses: [], usedBy: [], open: false };

type Measure = Pick<BrowserFacts, 'width' | 'height' | 'frames' | 'palette' | 'colours'>;

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

const MEASURE: Readonly<Partial<Record<AssetKey['kind'], (artwork: Artwork, id: string) => Measure>>> = {
  sprite: measureSprite,
  animation: measureAnimation,
  sheet: measureSheet,
  tileset: measureTileset,
  tilemap: measureTilemap,
  palette: measureBank,
};

const namesOf = (artwork: Artwork, keys: readonly AssetKey[]): readonly string[] =>
  keys.flatMap((key) => {
    const name = assetName(artwork, key);
    return name === null ? [] : [name];
  });

/** The cheap facts of one asset, read from the document without drawing it. */
const rowFacts = (artwork: Artwork, key: AssetKey, open: boolean): BrowserFacts => ({
  ...(MEASURE[key.kind]?.(artwork, key.id) ?? NO_FACTS),
  uses: namesOf(artwork, linkedKeys(artwork, key)),
  usedBy: namesOf(artwork, referrersOf(artwork, key)),
  open,
});

export { NO_FACTS, rowFacts };
