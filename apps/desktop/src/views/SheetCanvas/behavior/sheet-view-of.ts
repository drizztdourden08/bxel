/* @layer renderer-app @kind logic */
import type { ExportOutcome } from '../../../sheet-manager/export-result.type';
import type { SceneModel, SheetModel } from '../../../sheet/sheet.type';
import type { SheetView } from '../SheetCanvas.type';

const sheetViewOf = (data: SceneModel | null, model: SheetModel | null, image: ImageData | null, exported: ExportOutcome | null): SheetView | null => {
  if (!data || !model || !image) return null;
  if (exported?.ok) return { data, model, image, exported: exported.result, failure: null };
  return { data, model, image, exported: null, failure: exported ? exported.message : null };
};

export { sheetViewOf };
