/* @layer renderer-app @kind hook */
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import type { SheetView } from '../SheetCanvas.type';
import { sheetViewOf } from './sheet-view-of';
import { useSheetExport } from './useSheetExport';
import { useSheetImage } from './useSheetImage';
import { useSheetModel } from './useSheetModel';

const useSheetView = (): SheetView | null => {
  const data = useSpriteScene();
  const model = useSheetModel(data);
  const exported = useSheetExport(data, model);
  const image = useSheetImage(data, model, exported);
  return sheetViewOf(data, model, image, exported);
};

export { useSheetView };
