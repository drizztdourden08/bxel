/* @layer renderer-app @kind logic */
import { spritesGroups } from '../sheet/sprites-groups';
import { layerChips, layerCrumb } from './layer-parts';
import { HEADER_TEXT } from './stage-header.constants';
import type { Crumb, HeaderAction, HeaderActions, HeaderChip, HeaderInput, HeaderModel, SpriteHeader } from './stage-header.type';

const backCrumb = (actions: HeaderActions): Crumb => ({ id: 'back', label: HEADER_TEXT.back, icon: 'arrow-left', title: HEADER_TEXT.backTitle, run: actions.back });

const spriteCrumb = (sprite: SpriteHeader, actions: HeaderActions): Crumb => ({
  id: 'sprite',
  label: HEADER_TEXT.sprite(sprite.name),
  icon: 'pixel-sprite',
  menu: sprite.multi
    ? spritesGroups(sprite.spritesScope, actions.setSpritesScope).map((group) => ({ ...group, label: HEADER_TEXT.scopeMenu }))
    : undefined,
});

const paintingChips = (sprite: SpriteHeader, actions: HeaderActions): HeaderChip[] =>
  sprite.broadcast && sprite.count > 1
    ? [{ id: 'painting', text: HEADER_TEXT.painting(sprite.count), tone: 'warning', action: { label: HEADER_TEXT.stopPainting, run: actions.toggleBroadcast } }]
    : [];

const paintAll = (sprite: SpriteHeader, actions: HeaderActions): HeaderAction[] =>
  sprite.canBroadcast && !sprite.broadcast
    ? [{ label: HEADER_TEXT.paintAll, title: HEADER_TEXT.paintAllTitle, pressed: false, run: actions.toggleBroadcast }]
    : [];

const spriteHeader = (input: HeaderInput, actions: HeaderActions): HeaderModel => {
  const { sprite } = input;
  if (!sprite) return { crumbs: [], chips: [], actions: [] };
  const layer = layerCrumb(sprite, actions);
  return {
    crumbs: [...(sprite.isolated ? [backCrumb(actions)] : []), spriteCrumb(sprite, actions), ...(layer ? [layer] : [])],
    chips: [...paintingChips(sprite, actions), ...layerChips(sprite, actions, input.readOnly)],
    actions: paintAll(sprite, actions),
  };
};

export { backCrumb, spriteCrumb, spriteHeader };
