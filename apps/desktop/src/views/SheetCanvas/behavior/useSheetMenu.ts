/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { pickSpriteById } from '../../../sheet/pick-sprite-by-id';
import type { SheetItem } from '../../../sheet/sheet.type';
import { currentScene } from '../../../sheet/current-scene';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { SHEET_MENU } from '../SheetCanvas.constants';
import { sheetClicked } from './sheet-clicked';
import { sheetMenuEntries } from './sheet-menu-entries';

const useSheetMenu = (viewport: RefObject<PixelViewportHandle | null>, items: readonly SheetItem[]): void => {
  const pickClicked = (context: ContextMenuContext): void => {
    const hit = sheetClicked(context, viewport.current, items);
    const selected = currentScene()?.selected.some((sprite) => sprite.id === hit?.sprite.id) ?? false;
    if (hit && !selected) pickSpriteById(hit.sprite.id, 'replace');
  };
  useContextMenu(SHEET_MENU.zone, {
    label: SHEET_MENU.label,
    shouldOpen: () => useToolStore.getState().tool !== 'zoom',
    beforeOpen: pickClicked,
    entries: (context) => sheetMenuEntries(context, viewport.current, items),
  });
};

export { useSheetMenu };
