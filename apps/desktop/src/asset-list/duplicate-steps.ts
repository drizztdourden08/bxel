/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, AssetKey, CommandStep, SheetId, SpriteId } from '@bxel/document';
import { spritesTarget } from '../sheet/sprites-target';
import { copyName } from './copy-name';

const spriteCopy = (artwork: Artwork, id: SpriteId): { readonly name: string; readonly steps: readonly CommandStep[] } | null => {
  const sprite = artwork.sprites.find((each) => each.id === id);
  if (!sprite) return null;
  const name = copyName(artwork.sprites.map((each) => each.name), sprite.name);
  return { name, steps: [{ name: COMMAND_NAME.spriteDuplicate, targets: spritesTarget([id]), options: { name } }] };
};

const sheetCopy = (artwork: Artwork, id: SheetId): { readonly name: string; readonly steps: readonly CommandStep[] } | null => {
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

const duplicateSteps = (artwork: Artwork, key: AssetKey): { readonly name: string; readonly steps: readonly CommandStep[] } | null => {
  if (key.kind === 'sprite') return spriteCopy(artwork, key.id as SpriteId);
  return key.kind === 'sheet' ? sheetCopy(artwork, key.id as SheetId) : null;
};

export { duplicateSteps };
