/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { arrangeKindEntries } from '../../../context-menu/arrange-kind-entries';
import { viewEntries } from '../../../context-menu/view-entries';
import { FILE_COMMAND } from '../../../files/files.constants';
import { DIALOG_COMMAND } from '../../../keymap/dialog-command-id.constants';
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { SHEET_COMMAND as ID } from '../../../keymap/sheet-command-id.constants';
import { currentManager } from '../../../sheet-manager/current-manager';
import type { SheetItem } from '../../../sheet/sheet.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import { SHEET_MENU } from '../SheetCanvas.constants';
import { sheetClicked } from './sheet-clicked';
import { sheetSpriteEntries } from './sheet-sprite-entries';

const sheetMenuEntries = (context: ContextMenuContext, viewport: PixelViewportHandle | null, items: readonly SheetItem[]): readonly ContextMenuEntry[] => {
  const manager = currentManager();
  const onSprite = sheetClicked(context, viewport, items) !== null || (context.trigger === 'keyboard' && (manager?.ids.length ?? 0) > 0);
  if (onSprite) return sheetSpriteEntries();
  return [
    DIALOG_COMMAND.newSprite,
    { command: DIALOG_COMMAND.importImage, label: SHEET_MENU.importImage },
    { command: ID.importSheet, label: SHEET_MENU.sliceGrid },
    { command: SELECTION_COMMAND_ID.selectAll, label: SHEET_MENU.selectAll },
    { label: SHEET_MENU.arrange, items: arrangeKindEntries(manager?.sheet ?? null) },
    viewEntries({ major: false, tile: false, tiled: false, guides: false }),
    { command: FILE_COMMAND.export, label: SHEET_MENU.export },
  ];
};

export { sheetMenuEntries };
