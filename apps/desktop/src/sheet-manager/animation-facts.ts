/* @layer renderer-app @kind logic */
import { animationCells, findBank } from '@bxel/document';
import type { Animation, AnimationId, Artwork, Sheet, TagId } from '@bxel/document';
import { animationKey } from './animation-key';
import type { AnimationFacts } from './manager.type';


const sheetsOfAnimation = (artwork: Artwork, animationId: AnimationId): string[] =>
  artwork.sheets.filter((sheet) => (sheet.animationEntries ?? []).some((entry) => entry.animationId === animationId)).map((sheet) => sheet.name);

const nameOf = (animation: Animation, tagId: TagId | null): string => {
  const tag = animation.tags.find((each) => each.id === tagId);
  return tag?.kind === 'span' ? `${animation.name} ${tag.name}` : animation.name;
};

const factsOf = (artwork: Artwork, animation: Animation, tagId: TagId | null, at: { x: number; y: number }, onSheet: boolean): AnimationFacts => {
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

const animationFacts = (artwork: Artwork, sheet: Sheet | null): AnimationFacts[] =>
  (sheet?.animationEntries ?? []).flatMap((entry) => {
    const animation = artwork.animations.find((each) => each.id === entry.animationId);
    return animation ? [factsOf(artwork, animation, entry.tagId, entry.at, true)] : [];
  });

const libraryAnimations = (artwork: Artwork, sheet: Sheet | null): AnimationFacts[] => {
  const placed = new Set((sheet?.animationEntries ?? []).filter((entry) => entry.tagId === null).map((entry) => entry.animationId));
  return artwork.animations.filter((animation) => !placed.has(animation.id)).map((animation) => factsOf(artwork, animation, null, { x: 0, y: 0 }, false));
};

export { animationFacts, libraryAnimations };
