/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey, Sheet, SheetId } from '@bxel/document';
import { currentTab } from '../workspace/current-tab';

const sheetIdOfKey = (key: AssetKey | null | undefined): SheetId | null => (key?.kind === 'sheet' ? (key.id as SheetId) : null);

const boundSheetId = (): SheetId | null => sheetIdOfKey(currentTab()?.key);

const sheetOfKey = (artwork: Artwork, key: AssetKey | null | undefined): Sheet | null => {
  const id = sheetIdOfKey(key);
  return id === null ? null : (artwork.sheets.find((sheet) => sheet.id === id) ?? null);
};

export { boundSheetId, sheetIdOfKey, sheetOfKey };
