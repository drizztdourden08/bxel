/* @layer renderer-app @kind logic */
import { findAnimation, findBank, findSheet, findSprite, findTilemap, findTileset, sheetExtent, sheetSizes } from '@bxel/document';
import type { AnimationId, Artwork, AssetKey, BankId, SheetId, SpriteId, TilemapId, TilesetId } from '@bxel/document';
import { OVERVIEW_TEXT } from './asset-overview.constants';
import type { OverviewFact } from './asset-overview.type';

const fact = (label: string, value: string): OverviewFact => ({ label, value });

const spriteFacts = (artwork: Artwork, id: string): readonly OverviewFact[] => {
  const sprite = findSprite(artwork, id as SpriteId);
  if (!sprite) return [];
  return [
    fact(OVERVIEW_TEXT.size, OVERVIEW_TEXT.pixelSize(sprite.width, sprite.height)),
    fact(OVERVIEW_TEXT.layers, String(sprite.layers.length)),
    fact(OVERVIEW_TEXT.palette, findBank(artwork, sprite.bankId)?.name ?? OVERVIEW_TEXT.unknown),
  ];
};

const animationFacts = (artwork: Artwork, id: string): readonly OverviewFact[] => {
  const animation = findAnimation(artwork, id as AnimationId);
  if (!animation) return [];
  return [
    fact(OVERVIEW_TEXT.size, OVERVIEW_TEXT.pixelSize(animation.width, animation.height)),
    fact(OVERVIEW_TEXT.frames, String(animation.frames.length)),
    fact(OVERVIEW_TEXT.duration, OVERVIEW_TEXT.milliseconds(animation.frames.reduce((sum, frame) => sum + frame.durationMs, 0))),
    fact(OVERVIEW_TEXT.palette, findBank(artwork, animation.bankId)?.name ?? OVERVIEW_TEXT.unknown),
  ];
};

const sheetFacts = (artwork: Artwork, id: string): readonly OverviewFact[] => {
  const sheet = findSheet(artwork, id as SheetId);
  if (!sheet) return [];
  const extent = sheetExtent(sheet, sheetSizes(artwork));
  return [
    fact(OVERVIEW_TEXT.size, OVERVIEW_TEXT.pixelSize(extent.width, extent.height)),
    fact(OVERVIEW_TEXT.sprites, String(sheet.entries.length + (sheet.animationEntries?.length ?? 0))),
    fact(OVERVIEW_TEXT.layout, sheet.layout.kind),
  ];
};

const paletteFacts = (artwork: Artwork, id: string): readonly OverviewFact[] => {
  const bank = findBank(artwork, id as BankId);
  if (!bank) return [];
  return [fact(OVERVIEW_TEXT.capacity, String(bank.cap)), fact(OVERVIEW_TEXT.transparent, bank.transparent ? OVERVIEW_TEXT.yes : OVERVIEW_TEXT.no)];
};

const tilesetFacts = (artwork: Artwork, id: string): readonly OverviewFact[] => {
  const tileset = findTileset(artwork, id as TilesetId);
  if (!tileset) return [];
  return [
    fact(OVERVIEW_TEXT.tileSize, OVERVIEW_TEXT.pixelSize(tileset.tileWidth, tileset.tileHeight)),
    fact(OVERVIEW_TEXT.tiles, String(tileset.tiles.length)),
    fact(OVERVIEW_TEXT.palette, findBank(artwork, tileset.bankId)?.name ?? OVERVIEW_TEXT.unknown),
  ];
};

const tilemapFacts = (artwork: Artwork, id: string): readonly OverviewFact[] => {
  const tilemap = findTilemap(artwork, id as TilemapId);
  if (!tilemap) return [];
  return [
    fact(OVERVIEW_TEXT.mapSize, OVERVIEW_TEXT.cellSize(tilemap.columns, tilemap.rows)),
    fact(OVERVIEW_TEXT.mapLayers, String(tilemap.layers.length)),
    fact(OVERVIEW_TEXT.tileset, findTileset(artwork, tilemap.tilesetId)?.name ?? OVERVIEW_TEXT.unknown),
  ];
};

const kindFacts = (artwork: Artwork, key: AssetKey): readonly OverviewFact[] => {
  if (key.kind === 'sprite') return spriteFacts(artwork, key.id);
  if (key.kind === 'animation') return animationFacts(artwork, key.id);
  if (key.kind === 'sheet') return sheetFacts(artwork, key.id);
  if (key.kind === 'palette') return paletteFacts(artwork, key.id);
  if (key.kind === 'tileset') return tilesetFacts(artwork, key.id);
  return key.kind === 'tilemap' ? tilemapFacts(artwork, key.id) : [];
};

export { kindFacts };
