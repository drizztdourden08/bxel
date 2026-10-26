/* @layer renderer-app @kind logic */
import type { TiledImportData } from '../tiled-import/tiled-import.type';
import type { ImportKind, SourceImage } from './image-import.type';

const importKindOf = (image: SourceImage, tiled: TiledImportData | null): ImportKind => {
  if (tiled) return 'tiled';
  return image.frames ? 'animation' : 'sprite';
};

export { importKindOf };
