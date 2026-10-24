/* @layer core @kind logic */
import { CEL_DIR, CEL_EXTENSION, TILEMAP_DIR, TILEMAP_EXTENSION } from './container.constants';

const entryPaths = {
  cel: (id: string): string => `${CEL_DIR}${id}${CEL_EXTENSION}`,
  tilemapLayer: (id: string): string => `${TILEMAP_DIR}${id}${TILEMAP_EXTENSION}`,
  isTilemapLayer: (path: string): boolean => path.startsWith(TILEMAP_DIR) && path.endsWith(TILEMAP_EXTENSION),
  isCel: (path: string): boolean => path.startsWith(CEL_DIR) && path.endsWith(CEL_EXTENSION),
};

export { entryPaths };
