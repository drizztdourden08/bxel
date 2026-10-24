/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { Draft } from './draft.type';

const updateArtwork = (draft: Draft, change: (artwork: Artwork) => Artwork): void => {
  draft.artwork = change(draft.artwork);
};

export { updateArtwork };
