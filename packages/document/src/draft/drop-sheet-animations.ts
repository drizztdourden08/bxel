/* @layer core @kind logic */
import type { AnimationId, TagId } from '../model/ids.type';
import type { Sheet } from '../model/sheet.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const withoutEntries = (sheet: Sheet, animationId: AnimationId, tags: ReadonlySet<TagId> | null): Sheet => {
  const entries = sheet.animationEntries ?? [];
  const kept = entries.filter((entry) => entry.animationId !== animationId || (tags !== null && (entry.tagId === null || !tags.has(entry.tagId))));
  return kept.length === entries.length ? sheet : { ...sheet, animationEntries: kept };
};

const dropSheetAnimations = (draft: Draft, animationId: AnimationId, tags: ReadonlySet<TagId> | null = null): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    sheets: artwork.sheets.map((sheet) => withoutEntries(sheet, animationId, tags)),
  }));
};

export { dropSheetAnimations };
