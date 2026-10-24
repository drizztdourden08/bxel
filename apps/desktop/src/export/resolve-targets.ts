/* @layer renderer-app @kind logic */
import { findBank, nameKey, resolveFrames } from '@bxel/document';
import type { Artwork, Frame, Sprite, SpriteId } from '@bxel/document';
import { NO_CURRENT } from '../editor/current-pick.constants';
import type { CurrentPick } from '../editor/current-pick.type';
import { listSprites } from '../sheet/list-sprites';
import { EXPORT_TEXT } from './export.constants';
import type { ExportSettings, Target, TargetsResult } from './export.type';
import { layered } from './layered';

const pickSprites = (artwork: Artwork, settings: ExportSettings, selectedIds: readonly SpriteId[], current: CurrentPick): Sprite[] => {
  const own = listSprites(artwork);
  if (settings.sprites === 'all') return [...own];
  if (settings.sprites === 'selected') return own.filter((sprite) => selectedIds.includes(sprite.id));
  const picked = own.find((sprite) => sprite.id === current.spriteId) ?? own[0];
  return picked ? [picked] : [];
};

const pickFrames = (sprite: Sprite, settings: ExportSettings, current: CurrentPick): Frame[] => {
  const shown = sprite.frames.find((frame) => frame.id === current.frameId) ?? sprite.frames[0];
  if (settings.kind === 'sprite' || settings.frames === 'current') return shown ? [shown] : [];
  if (settings.frames === 'tag') return resolveFrames({ sprite, selector: { by: 'tag', name: settings.tag } });
  return [...sprite.frames];
};

const targetOf = (artwork: Artwork, sprite: Sprite, settings: ExportSettings, current: CurrentPick): Target | string => {
  const bank = findBank(artwork, sprite.bankId);
  const frames = pickFrames(sprite, settings, current);
  const wanted = settings.frames === 'tag' && settings.kind !== 'sprite' ? settings.tag : null;
  if (!bank || frames.length === 0) {
    return wanted === null ? EXPORT_TEXT.noFrames(sprite.name) : EXPORT_TEXT.noTag(sprite.name, wanted);
  }
  const tag = wanted === null ? null : (sprite.tags.find((each) => nameKey(each.name) === nameKey(wanted)) ?? null);
  return { sprite: layered(sprite, settings.layers), bank, frames, tag };
};

const resolveTargets = (
  artwork: Artwork,
  settings: ExportSettings,
  selectedIds: readonly SpriteId[],
  current: CurrentPick = NO_CURRENT,
): TargetsResult => {
  const sprites = pickSprites(artwork, settings, selectedIds, current);
  if (sprites.length === 0) {
    return { ok: false, message: settings.sprites === 'selected' ? EXPORT_TEXT.noSelection : EXPORT_TEXT.noSprite };
  }
  if (settings.frames === 'tag' && settings.kind !== 'sprite' && settings.tag === '') {
    return { ok: false, message: EXPORT_TEXT.chooseTag };
  }
  const targets: Target[] = [];
  for (const sprite of sprites) {
    const target = targetOf(artwork, sprite, settings, current);
    if (typeof target === 'string') return { ok: false, message: target };
    targets.push(target);
  }
  return { ok: true, targets };
};

export { resolveTargets };
