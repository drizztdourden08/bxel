/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey, Sheet, SheetId } from '@bxel/document';
import { useManagerStore } from '../stores/useManagerStore';
import { currentTab } from '../workspace/current-tab';

const sheetIdOfKey = (key: AssetKey | null | undefined): SheetId | null => (key?.kind === 'sheet' ? (key.id as SheetId) : null);

/** The sheet of the open tab; while a sprite of it is isolated the tab is not a sheet, so the last sheet shown stands in. */
const sheetIdFor = (key: AssetKey | null | undefined, last: SheetId | null): SheetId | null => sheetIdOfKey(key) ?? last;

const boundSheetId = (): SheetId | null => sheetIdFor(currentTab()?.key, useManagerStore.getState().sheetId);

const sheetOfKey = (artwork: Artwork, key: AssetKey | null | undefined): Sheet | null => {
  const id = sheetIdOfKey(key);
  return id === null ? null : (artwork.sheets.find((sheet) => sheet.id === id) ?? null);
};

export { boundSheetId, sheetIdFor, sheetIdOfKey, sheetOfKey };
