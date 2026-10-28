/* @layer renderer-app @kind logic */
import { spritesGroups } from '../sheet/sprites-groups';
import { HEADER_TEXT } from './stage-header.constants';
import type { Crumb, HeaderActions, SpriteHeader } from './stage-header.type';

const spriteCrumb = (sprite: SpriteHeader, actions: HeaderActions): Crumb => ({
  id: 'sprite',
  label: HEADER_TEXT.sprite(sprite.name),
  icon: 'pixel-sprite',
  menu: sprite.multi
    ? spritesGroups(sprite.spritesScope, actions.setSpritesScope).map((group) => ({ ...group, label: HEADER_TEXT.scopeMenu }))
    : undefined,
});

export { spriteCrumb };
