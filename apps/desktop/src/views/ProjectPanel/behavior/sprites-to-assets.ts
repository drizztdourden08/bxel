/* @layer renderer-app @kind logic */
import { ANIMATE_START } from '../../../sheet-manager/compose.constants';
import { addToSheet } from '../../../sheet-manager/add-to-sheet';
import { makeAnimationFrom } from '../../../sheet-manager/make-animation-from';
import { currentArtwork } from '../../../sheet/current-artwork';
import { uniqueName } from '../../../sprite-name/unique-name';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { spriteIdsOf } from './sprite-ids-of';

const newSheetFrom = (items: readonly BrowserItem[]): void => {
  const ids = spriteIdsOf(items);
  if (ids.length > 0) addToSheet(ids, null);
};

const newAnimationFrom = (items: readonly BrowserItem[]): void => {
  const ids = spriteIdsOf(items);
  const base = items.find((item) => item.row?.kind === 'sprite')?.name ?? 'animation';
  const taken = currentArtwork()?.animations.map((animation) => animation.name) ?? [];
  if (ids.length > 0) void makeAnimationFrom(ids, uniqueName(base, taken), { ...ANIMATE_START, name: base });
};

export { newAnimationFrom, newSheetFrom };
