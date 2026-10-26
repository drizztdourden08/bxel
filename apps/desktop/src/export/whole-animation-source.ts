/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { animationExport } from './animation-export';
import { animationFramesSprite } from './animation-frames-sprite';
import { EXPORT_TEXT } from './export.constants';
import type { ExportSettings } from './export.type';
import type { AnimationSources } from './export-parts.type';

const wholeAnimationSource = (artwork: Artwork, settings: ExportSettings): AnimationSources | string => {
  const animation = artwork.animations.find((each) => each.id === settings.animationId);
  if (!animation) return EXPORT_TEXT.noAnimation;
  const sprite = settings.kind === 'frames' ? animationFramesSprite(artwork, animation) : animationExport(artwork, animation);
  return typeof sprite === 'string' ? sprite : { sprites: [sprite], only: true, title: animation.name };
};

export { wholeAnimationSource };
