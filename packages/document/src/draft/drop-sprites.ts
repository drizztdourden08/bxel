/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { prunePresets } from './prune-presets';
import { removeFromSheets } from './remove-from-sheets';
import { removeSprites } from './remove-sprites';

const dropSprites = (draft: Draft, gone: ReadonlySet<SpriteId>): void => {
  removeFromSheets(draft, gone);
  removeSprites(draft, gone);
  prunePresets(draft, gone);
};

export { dropSprites };
