/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { MapLayer } from '../../model/tilemap.type';
import type { MapLayerJson } from '../document-json.type';
import { requireLinks } from './link-needs';
import type { TilemapFileJson } from './tilemap-file.type';

const layerShell = ({ id, name, visible, locked, colour }: MapLayer): MapLayerJson => ({
  id,
  name,
  visible,
  locked,
  ...(colour === undefined ? {} : { colour }),
});

const tilemapToFile = (slice: AssetSlice): TilemapFileJson => {
  const { tilemaps = [] } = slice.artwork;
  const [tilemap] = tilemaps;
  if (tilemaps.length !== 1 || !tilemap) throw new Error('A tilemap file holds exactly one tilemap.');
  requireLinks([tilemap.tilesetId], slice.links, 'A tilemap file');
  return { tilemap: { ...tilemap, layers: tilemap.layers.map(layerShell) } };
};

export { tilemapToFile };
