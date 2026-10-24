/* @layer renderer-app @kind logic */
import { exportTilesetImage, writeTiledJson, writeTilemapJson } from '@bxel/formats';
import type { Artwork } from '@bxel/document';
import type { ExportSettings, MapPick, PlannedFile } from './export.type';
import { mapExportInput } from './map-export-input';
import { MAP_EXPORT, MAP_EXPORT_TEXT } from './map-export.constants';
import { tileSheetInput } from './tile-sheet-input';

const buildMapFiles = (artwork: Artwork, pick: MapPick, settings: ExportSettings, base: string): PlannedFile[] | string => {
  const { tilemap, tileset } = pick;
  const imageName = `${base}${MAP_EXPORT.suffix}.png`;
  const mapName = `${base}.${MAP_EXPORT.extensions[settings.mapFormat]}`;
  const sheet = exportTilesetImage(tileSheetInput(artwork, tileset));
  if (!sheet.ok) return sheet.message;
  const mapInput = mapExportInput(tilemap, tileset, sheet, imageName);
  const json = settings.mapFormat === 'tiled' ? writeTiledJson(mapInput) : writeTilemapJson(mapInput);
  if (!json.ok) return json.message;
  return [
    {
      name: imageName,
      detail: MAP_EXPORT_TEXT.tilesDetail(imageName, sheet.image.width, sheet.image.height, tileset.tiles.length),
      spriteIndex: 0,
      width: sheet.image.width,
      height: sheet.image.height,
      make: () => ({ ok: true, data: { kind: 'bytes', bytes: sheet.png } }),
    },
    {
      name: mapName,
      detail: MAP_EXPORT_TEXT.mapDetail(mapName, tilemap.columns, tilemap.rows, tilemap.layers.length),
      spriteIndex: 0,
      width: null,
      height: null,
      make: () => ({ ok: true, data: { kind: 'text', text: json.json } }),
    },
  ];
};

export { buildMapFiles };
