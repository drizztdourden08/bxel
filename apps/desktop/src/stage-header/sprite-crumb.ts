/* @layer renderer-app @kind logic */
import { SHEET_TEXT } from '../sheet/sheet.constants';
import { spritesGroups } from '../sheet/sprites-groups';
import { HEADER_TEXT } from './stage-header.constants';
import type { Crumb, HeaderActions, SpriteHeader } from './stage-header.type';

const spriteLabel = (sprite: SpriteHeader): string => {
  if (!sprite.multi) return HEADER_TEXT.sprite(sprite.name);
  return sprite.spritesScope === 'current' ? SHEET_TEXT.spriteChip(sprite.name) : SHEET_TEXT.spritesChip(sprite.count);
};

const spriteCrumb = (sprite: SpriteHeader, actions: HeaderActions): Crumb => ({
  id: 'sprite',
  label: spriteLabel(sprite),
  icon: 'pixel-sprite',
  menu: sprite.multi
    ? spritesGroups(sprite.spritesScope, actions.setSpritesScope).map((group) => ({ ...group, label: HEADER_TEXT.scopeMenu }))
    : undefined,
});

export { spriteCrumb };
