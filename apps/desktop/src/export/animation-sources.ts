/* @layer renderer-app @kind logic */
import type { Animation, Artwork, Sheet, SheetAnimationEntry } from '@bxel/document';
import type { ExportSprite } from '@bxel/formats';
import { animationExport } from './animation-export';
import { EXPORT_TEXT } from './export.constants';
import type { ExportSettings } from './export.type';
import type { AnimationSources } from './export-parts.type';
import { wholeAnimationSource } from './whole-animation-source';

const entrySprite = (artwork: Artwork, entry: SheetAnimationEntry): ExportSprite | string => {
  const animation: Animation | undefined = artwork.animations.find((each) => each.id === entry.animationId);
  return animation ? animationExport(artwork, animation, entry.tagId) : EXPORT_TEXT.noAnimation;
};

const uniqueNames = (sprites: readonly ExportSprite[]): ExportSprite[] => {
  const seen = new Map<string, number>();
  return sprites.map((sprite) => {
    const count = (seen.get(sprite.name) ?? 0) + 1;
    seen.set(sprite.name, count);
    return count === 1 ? sprite : { ...sprite, name: `${sprite.name}_${count}` };
  });
};

const sheetSources = (artwork: Artwork, sheet: Sheet): AnimationSources | string | null => {
  const entries = sheet.animationEntries ?? [];
  if (entries.length === 0) return null;
  const sprites: ExportSprite[] = [];
  for (const entry of entries) {
    const sprite = entrySprite(artwork, entry);
    if (typeof sprite === 'string') return sprite;
    sprites.push(sprite);
  }
  return { sprites: uniqueNames(sprites), only: sheet.entries.length === 0, title: sheet.name };
};

const animationSources = (artwork: Artwork, settings: ExportSettings): AnimationSources | string | null => {
  if (settings.animationId !== '' && (settings.kind === 'animation' || settings.kind === 'sheet' || settings.kind === 'frames')) {
    return wholeAnimationSource(artwork, settings);
  }
  if (settings.kind !== 'sheet' || settings.sprites !== 'sheet') return null;
  const sheet = artwork.sheets.find((each) => each.id === settings.sheetId);
  return sheet ? sheetSources(artwork, sheet) : null;
};

export { animationSources };
