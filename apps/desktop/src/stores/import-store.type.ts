/* @layer renderer-app @kind types */
import type { SourceImage } from '../image-import/image-import.type';
import type { TiledImportData } from '../tiled-import/tiled-import.type';

interface ImportState {
  image: SourceImage | null;
  tiled: TiledImportData | null;
  show: (image: SourceImage, tiled?: TiledImportData) => void;
  hide: () => void;
}

export type { ImportState };
