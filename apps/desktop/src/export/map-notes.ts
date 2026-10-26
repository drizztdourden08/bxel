/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { ExportSettings, MapPick } from './export.type';
import { MAP_EXPORT_TEXT } from './map-export.constants';
import { tileAnimationFrames } from './tile-animation-frames';
import { TILE_ANIMATION_TEXT } from './tile-animation-frames.constants';

const mapNotes = (artwork: Artwork, pick: MapPick, settings: ExportSettings): string[] => {
  const tiled = settings.mapFormat === 'tiled';
  const frames = tileAnimationFrames(artwork, pick.tileset);
  const random = frames.animations.some((entry) => entry.start === 'random');
  return [
    tiled ? MAP_EXPORT_TEXT.tiledNote : MAP_EXPORT_TEXT.bxelNote,
    ...(frames.tiles.length > 0 ? [TILE_ANIMATION_TEXT.extraTiles(frames.tiles.length)] : []),
    ...(tiled && random ? [TILE_ANIMATION_TEXT.randomStart] : []),
    ...frames.skipped,
  ];
};

export { mapNotes };
