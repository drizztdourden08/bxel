/* @layer renderer-app @kind logic */
import type { MapContext, MapTarget } from './tilemap.type';

const mapTarget = (context: MapContext | null): MapTarget | null => {
  if (!context?.tileset || !context.tilemap || !context.layer) return null;
  return { artwork: context.artwork, tileset: context.tileset, tilemap: context.tilemap, layer: context.layer };
};

export { mapTarget };
