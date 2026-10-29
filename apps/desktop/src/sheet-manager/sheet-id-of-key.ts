/* @layer renderer-app @kind logic */
import type { AssetKey, SheetId } from '@bxel/document';

const sheetIdOfKey = (key: AssetKey | null | undefined): SheetId | null => (key?.kind === 'sheet' ? (key.id as SheetId) : null);

export { sheetIdOfKey };
