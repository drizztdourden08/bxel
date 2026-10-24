/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, AssetKey, BankId, SheetId, SpriteId, TilemapId, TilesetId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { spritesTarget } from '../sheet/sprites-target';
import type { DuplicatePlan } from './duplicate-steps.type';
import { copyName } from './copy-name';

const spriteCopy = (artwork: Artwork, id: SpriteId): DuplicatePlan | null => {
  const sprite = artwork.sprites.find((each) => each.id === id);
  if (!sprite) return null;
  const name = copyName(artwork.sprites.map((each) => each.name), sprite.name);
  return { name, steps: [{ name: COMMAND_NAME.spriteDuplicate, targets: spritesTarget([id]), options: { name } }] };
};

const sheetCopy = (artwork: Artwork, id: SheetId): DuplicatePlan | null => {
  const sheet = artwork.sheets.find((each) => each.id === id);
  if (!sheet) return null;
  const name = copyName(artwork.sheets.map((each) => each.name), sheet.name);
  const { layout, spacing, margin } = sheet;
  const create: CommandStep = { name: COMMAND_NAME.sheetCreate, targets: null, options: { name, layout, spacing, margin }, ref: 'copy' };
  if (sheet.entries.length === 0) return { name, steps: [create] };
  const places = sheet.entries.map((entry) => ({ at: entry.at, source: entry.source }));
  const add: CommandStep = {
    name: COMMAND_NAME.sheetAdd,
    targets: spritesTarget(sheet.entries.map((entry) => entry.spriteId)),
    options: { sheet: { ref: 'copy' }, places },
  };
  return { name, steps: [create, add] };
};

const paletteCopy = (artwork: Artwork, id: BankId): DuplicatePlan | null => {
  const bank = artwork.banks.find((each) => each.id === id);
  if (!bank) return null;
  const name = copyName(artwork.banks.map((each) => each.name), bank.name);
  return { name, steps: [{ name: PALETTE_COMMAND_NAME.paletteDuplicate, targets: null, options: { bankId: id, name } }] };
};

const tilesetCopy = (artwork: Artwork, id: TilesetId): DuplicatePlan | null => {
  const tileset = artwork.tilesets.find((each) => each.id === id);
  if (!tileset) return null;
  const name = copyName(artwork.tilesets.map((each) => each.name), tileset.name);
  return { name, steps: [{ name: COMMAND_NAME.tilesetDuplicate, targets: null, options: { tileset: id, name } }] };
};

const tilemapCopy = (artwork: Artwork, id: TilemapId): DuplicatePlan | null => {
  const tilemap = artwork.tilemaps.find((each) => each.id === id);
  if (!tilemap) return null;
  const name = copyName(artwork.tilemaps.map((each) => each.name), tilemap.name);
  return { name, steps: [{ name: COMMAND_NAME.tilemapDuplicate, targets: null, options: { tilemap: id, name } }] };
};

const duplicateSteps = (artwork: Artwork, key: AssetKey): DuplicatePlan | null => {
  if (key.kind === 'sprite') return spriteCopy(artwork, key.id as SpriteId);
  if (key.kind === 'sheet') return sheetCopy(artwork, key.id as SheetId);
  if (key.kind === 'palette') return paletteCopy(artwork, key.id as BankId);
  if (key.kind === 'tileset') return tilesetCopy(artwork, key.id as TilesetId);
  return key.kind === 'tilemap' ? tilemapCopy(artwork, key.id as TilemapId) : null;
};

export { duplicateSteps };
