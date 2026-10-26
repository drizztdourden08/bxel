/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Artwork } from '../model/artwork.type';
import type { Sheet } from '../model/sheet.type';
import { findSprite } from '../read/find-sprite';
import { nameKey } from '../validate/name-key';

const checkEntries = (artwork: Artwork, sheet: Sheet): void => {
  const seen = new Set<string>();
  for (const entry of sheet.entries) {
    const sprite = findSprite(artwork, entry.spriteId);
    if (!sprite || sprite.role !== 'sprite' || seen.has(entry.spriteId)) {
      throw fail(ERROR_CODE.REFERENCE_BROKEN, `Sheet "${sheet.name}" holds an entry that is not one sprite of the file.`);
    }
    seen.add(entry.spriteId);
  }
};

const checkSheets = (artwork: Artwork, base: Artwork): void => {
  if (artwork.sheets === base.sheets && artwork.sprites === base.sprites && artwork.presets === base.presets) return;
  if (new Set(artwork.sheets.map((sheet) => nameKey(sheet.name))).size !== artwork.sheets.length) {
    throw fail(ERROR_CODE.NAME_TAKEN, 'Sheet names must be unique in a file.');
  }
  for (const sheet of artwork.sheets) checkEntries(artwork, sheet);
  const known = new Set(artwork.sheets.map((sheet) => sheet.id));
  if (artwork.presets.some((preset) => preset.sheetId !== null && !known.has(preset.sheetId))) {
    throw fail(ERROR_CODE.REFERENCE_BROKEN, 'An export preset names a sheet that does not exist.');
  }
};

export { checkSheets };
