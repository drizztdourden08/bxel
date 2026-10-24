/* @layer core @kind logic */
import type { AssetContent, AssetRef } from '../../model/asset.type';
import type { Sheet } from '../../model/sheet.type';
import { placeholderBank } from './placeholder-bank';
import { placeholderSize } from './placeholder-size';
import { placeholderSprite } from './placeholder-sprite';

const sheetPlaceholders = (sheet: Sheet, missing: readonly AssetRef[]): AssetContent => {
  if (missing.length === 0) return {};
  const bank = placeholderBank(sheet.id);
  return {
    banks: [bank],
    sprites: missing.map((link) => placeholderSprite(link, placeholderSize(sheet, link.id), bank.id)),
  };
};

export { sheetPlaceholders };
