/* @layer renderer-app @kind types */
import type { PaletteExportFormatName, PaletteImportMode } from '../../palette-export/palette-file-tool.type';
import type { ProjectLocation } from './tool-input.type';

type PaletteBankInput = { readonly documentId: string; readonly expectedRevision?: number; readonly bankId?: string };

type ExportPaletteInput = PaletteBankInput & {
  readonly indexes?: readonly number[];
  readonly format: PaletteExportFormatName;
  readonly scale: number;
  readonly overwrite?: boolean;
  readonly fileName?: string;
  readonly location?: ProjectLocation;
};

type ImportPaletteInput = PaletteBankInput & {
  readonly file: ProjectLocation;
  readonly mode: PaletteImportMode;
};

export type { ExportPaletteInput, ImportPaletteInput, PaletteBankInput };
