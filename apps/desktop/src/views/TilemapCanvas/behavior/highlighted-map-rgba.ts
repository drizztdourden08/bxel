/* @layer renderer-app @kind logic */
import type { Artwork, TilemapId } from '@bxel/document';
import { DIMMED_ALPHA } from '../../../editor/frame-view.constants';
import { CHANNELS } from '../../../sheet/sheet.constants';
import type { FlatRgba, HighlightPass } from '../TilemapCanvas.type';
import { blendOver } from './blend-over';
import { flatMapRgba } from './flat-map-rgba';
import { layersShown } from './layers-shown';

const passesAround = (at: number): readonly HighlightPass[] => [
  { shows: (index) => index < at, strength: DIMMED_ALPHA },
  { shows: (index) => index === at, strength: 1 },
  { shows: (index) => index > at, strength: DIMMED_ALPHA },
];

const highlightedMapRgba = (artwork: Artwork, tilemapId: TilemapId, at: number): FlatRgba | null => {
  const flats = passesAround(at).map((pass) => ({ pass, flat: flatMapRgba(layersShown(artwork, tilemapId, pass.shows), tilemapId) }));
  const first = flats[0]?.flat;
  if (!first) return null;
  const rgba = new Uint8ClampedArray(first.width * first.height * CHANNELS);
  flats.forEach(({ pass, flat }) => flat && blendOver(rgba, flat.rgba, pass.strength));
  return { rgba, width: first.width, height: first.height };
};

export { highlightedMapRgba };
