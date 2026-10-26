/* @layer core @kind logic */
import { ID_PREFIX } from '../../ids/id-prefix.constants';
import { isId } from '../../ids/is-id';
import type { AssetContent, AssetRef } from '../../model/asset.type';
import type { Sheet } from '../../model/sheet.type';
import { placeholderAnimation } from './placeholder-animation';
import { placeholderBank } from './placeholder-bank';
import { placeholderSize } from './placeholder-size';
import { placeholderSprite } from './placeholder-sprite';
import { PLACEHOLDER_SPRITE_SIZE } from './placeholder.constants';

const sheetPlaceholders = (sheet: Sheet, missing: readonly AssetRef[]): AssetContent => {
  if (missing.length === 0) return {};
  const bank = placeholderBank(sheet.id);
  const animated = missing.filter((link) => isId(link.id, ID_PREFIX.animation));
  const drawn = missing.filter((link) => !animated.includes(link));
  const size = { width: PLACEHOLDER_SPRITE_SIZE, height: PLACEHOLDER_SPRITE_SIZE };
  const tagsOf = (id: string) => (sheet.animationEntries ?? []).flatMap((entry) => (entry.animationId === id && entry.tagId ? [entry.tagId] : []));
  return {
    banks: [bank],
    sprites: drawn.map((link) => placeholderSprite(link, placeholderSize(sheet, link.id), bank.id)),
    ...(animated.length > 0 ? { animations: animated.map((link) => placeholderAnimation(link, size, bank.id, tagsOf(link.id))) } : {}),
  };
};

export { sheetPlaceholders };
