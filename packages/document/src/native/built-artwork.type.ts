/* @layer core @kind types */
import type { Artwork } from '../model/artwork.type';
import type { DamagedCel, LoadIssue } from './load-report.type';

type BuiltArtwork = {
  readonly artwork: Artwork;
  readonly damage: readonly DamagedCel[];
  readonly issues: readonly LoadIssue[];
};

export type { BuiltArtwork };
