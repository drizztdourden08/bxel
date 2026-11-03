/* @layer renderer-app @kind types */
import type { ImportKind, SourceImage } from '../image-import/image-import.type';
import type { TiledImportData } from '../tiled-import/tiled-import.type';

interface ImportState {
  image: SourceImage | null;
  tiled: TiledImportData | null;
  kind: ImportKind | null;
  sheetId: string | null;
  show: (image: SourceImage, tiled?: TiledImportData, kind?: ImportKind, sheetId?: string | null) => void;
  hide: () => void;
}

export type { ImportState };
