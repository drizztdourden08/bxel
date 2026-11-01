/* @layer renderer-app @kind types */
type PaletteExportId = 'gpl' | 'pal' | 'hex' | 'txt' | 'ase' | 'png-1' | 'png-8' | 'png-32';

interface PaletteExportFormat {
  id: PaletteExportId;
  label: string;
  extension: string;
  scale: number;
}

type PaletteExportBytes = { ok: true; bytes: Uint8Array } | { ok: false; message: string };

export type { PaletteExportBytes, PaletteExportFormat, PaletteExportId };
