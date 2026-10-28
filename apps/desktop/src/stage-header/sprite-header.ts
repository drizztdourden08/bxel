/* @layer renderer-app @kind logic */
import { backCrumb } from './back-crumb';
import { layerChips } from './layer-chips';
import { layerCrumb } from './layer-crumb';
import { spriteCrumb } from './sprite-crumb';
import { HEADER_TEXT } from './stage-header.constants';
import type { HeaderAction, HeaderActions, HeaderChip, HeaderInput, HeaderModel, SpriteHeader } from './stage-header.type';

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

export { spriteHeader };
