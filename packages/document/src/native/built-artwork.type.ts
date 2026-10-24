/* @layer core @kind types */
import type { Artwork } from '../model/artwork.type';
import type { DamagedCel, DamagedMapLayer } from './load-report.type';

type BuiltArtwork = {
  readonly artwork: Artwork;
  readonly damage: readonly DamagedCel[];
  readonly mapDamage: readonly DamagedMapLayer[];
};

export type { BuiltArtwork };
