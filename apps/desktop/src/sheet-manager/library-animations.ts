/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { animationFactsOf } from './animation-facts-of';
import type { AnimationFacts } from './manager.type';

const libraryAnimations = (artwork: Artwork, sheet: Sheet | null): AnimationFacts[] => {
  const placed = new Set((sheet?.animationEntries ?? []).filter((entry) => entry.tagId === null).map((entry) => entry.animationId));
  return artwork.animations
    .filter((animation) => !placed.has(animation.id))
    .map((animation) => animationFactsOf(artwork, animation, { tagId: null, at: { x: 0, y: 0 }, onSheet: false }));
};

export { libraryAnimations };
