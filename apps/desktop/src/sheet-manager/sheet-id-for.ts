/* @layer renderer-app @kind logic */
import type { AssetKey, SheetId } from '@bxel/document';
import { sheetIdOfKey } from './sheet-id-of-key';

const sheetIdFor = (key: AssetKey | null | undefined, last: SheetId | null): SheetId | null => sheetIdOfKey(key) ?? last;

export { sheetIdFor };
