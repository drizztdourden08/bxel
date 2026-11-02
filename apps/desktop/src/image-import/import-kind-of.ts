/* @layer renderer-app @kind logic */
import type { TiledImportData } from '../tiled-import/tiled-import.type';
import type { ImportKind, SourceImage } from './image-import.type';

const importKindOf = (image: SourceImage, tiled: TiledImportData | null, chosen: ImportKind | null = null): ImportKind => {
  if (chosen) return chosen;
  if (tiled) return 'tiled';
  return image.frames ? 'animation' : 'sprite';
};

export { importKindOf };
