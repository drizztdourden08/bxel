/* @layer renderer-app @kind logic */
import { findBank, nameKey, resolveFrames } from '@bxel/document';
import type { Artwork, Frame, Sprite, SpriteId } from '@bxel/document';
import { EXPORT_TEXT } from './export.constants';
import type { ExportSettings, Target, TargetsResult } from './export.type';
import { layered } from './layered';

const pickSprites = (artwork: Artwork, settings: ExportSettings, selectedIds: readonly SpriteId[]): Sprite[] => {
  if (settings.sprites === 'all') return [...artwork.sprites];
  if (settings.sprites === 'selected') return artwork.sprites.filter((sprite) => selectedIds.includes(sprite.id));
  const first = artwork.sprites[0];
  return first ? [first] : [];
};

const pickFrames = (sprite: Sprite, settings: ExportSettings): Frame[] => {
  const first = sprite.frames[0];
  if (settings.kind === 'sprite' || settings.frames === 'current') return first ? [first] : [];
  if (settings.frames === 'tag') return resolveFrames({ sprite, selector: { by: 'tag', name: settings.tag } });
  return [...sprite.frames];
};

const targetOf = (artwork: Artwork, sprite: Sprite, settings: ExportSettings): Target | string => {
  const bank = findBank(artwork, sprite.bankId);
  const frames = pickFrames(sprite, settings);
  const wanted = settings.frames === 'tag' && settings.kind !== 'sprite' ? settings.tag : null;
  if (!bank || frames.length === 0) {
    return wanted === null ? EXPORT_TEXT.noFrames(sprite.name) : EXPORT_TEXT.noTag(sprite.name, wanted);
  }
  const tag = wanted === null ? null : (sprite.tags.find((each) => nameKey(each.name) === nameKey(wanted)) ?? null);
  return { sprite: layered(sprite, settings.layers), bank, frames, tag };
};

const resolveTargets = (artwork: Artwork, settings: ExportSettings, selectedIds: readonly SpriteId[]): TargetsResult => {
  const sprites = pickSprites(artwork, settings, selectedIds);
  if (sprites.length === 0) {
    return { ok: false, message: settings.sprites === 'selected' ? EXPORT_TEXT.noSelection : EXPORT_TEXT.noSprite };
  }
  if (settings.frames === 'tag' && settings.kind !== 'sprite' && settings.tag === '') {
    return { ok: false, message: EXPORT_TEXT.chooseTag };
  }
  const targets: Target[] = [];
  for (const sprite of sprites) {
    const target = targetOf(artwork, sprite, settings);
    if (typeof target === 'string') return { ok: false, message: target };
    targets.push(target);
  }
  return { ok: true, targets };
};

export { resolveTargets };
