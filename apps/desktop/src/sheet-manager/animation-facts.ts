/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { animationFactsOf } from './animation-facts-of';
import type { AnimationFacts } from './manager.type';

const animationFacts = (artwork: Artwork, sheet: Sheet | null): AnimationFacts[] =>
  (sheet?.animationEntries ?? []).flatMap((entry) => {
    const animation = artwork.animations.find((each) => each.id === entry.animationId);
    return animation ? [animationFactsOf(artwork, animation, { tagId: entry.tagId, at: entry.at, onSheet: true })] : [];
  });

export { animationFacts };
