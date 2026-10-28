/* @layer renderer-app @kind hook */
import type { SheetId } from '@bxel/document';
import { sheetIdOfKey } from '../sheet-manager/bound-sheet';
import { useActiveAsset } from './useActiveAsset';

const useBoundSheetId = (): SheetId | null => sheetIdOfKey(useActiveAsset()?.tab?.key);

export { useBoundSheetId };
