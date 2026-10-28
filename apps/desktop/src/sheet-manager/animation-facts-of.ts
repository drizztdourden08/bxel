/* @layer renderer-app @kind logic */
import { animationCells, findBank } from '@bxel/document';
import type { Animation, AnimationId, Artwork, TagId } from '@bxel/document';
import { animationKey } from './animation-key';
import type { AnimationPlacement } from './animation-facts-of.type';
import type { AnimationFacts } from './manager.type';

const sheetsOfAnimation = (artwork: Artwork, animationId: AnimationId): string[] =>
  artwork.sheets.filter((sheet) => (sheet.animationEntries ?? []).some((entry) => entry.animationId === animationId)).map((sheet) => sheet.name);

const nameOf = (animation: Animation, tagId: TagId | null): string => {
  const tag = animation.tags.find((each) => each.id === tagId);
  return tag?.kind === 'span' ? `${animation.name} ${tag.name}` : animation.name;
};

const animationFactsOf = (artwork: Artwork, animation: Animation, placement: AnimationPlacement): AnimationFacts => {
  const { tagId, at, onSheet } = placement;
  const cells = animationCells(animation, tagId);
  const durations = new Map(animation.frames.map((frame) => [frame.id, frame.durationMs] as const));
  return {
    kind: 'animation',
    key: animationKey(animation.id, tagId),
    animation,
    tagId,
    name: nameOf(animation, tagId),
    at,
    frames: cells.length,
    durationMs: cells.reduce((sum, cell) => sum + (durations.get(cell.frameId) ?? 0), 0),
    bank: findBank(artwork, animation.bankId)?.name ?? '',
    onSheet,
    sheets: sheetsOfAnimation(artwork, animation.id),
  };
};

export { animationFactsOf };
