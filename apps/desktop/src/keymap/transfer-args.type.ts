/* @layer renderer-app @kind types */
import type { PaletteExportId } from '../palette-export/palette-export.type';

interface TransferArgs {
  format: PaletteExportId;
  selection: boolean;
  bankId: string;
}

export type { TransferArgs };
