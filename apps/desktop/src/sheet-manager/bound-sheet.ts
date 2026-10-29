/* @layer renderer-app @kind logic */
import type { SheetId } from '@bxel/document';
import { useManagerStore } from '../stores/useManagerStore';
import { currentTab } from '../workspace/current-tab';
import { sheetIdFor } from './sheet-id-for';

const boundSheetId = (): SheetId | null => sheetIdFor(currentTab()?.key, useManagerStore.getState().sheetId);

export { boundSheetId };
