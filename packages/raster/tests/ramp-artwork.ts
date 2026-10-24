/* @layer tests @kind logic */
import type { Artwork, RampId, SwatchId } from '@bxel/document';
import { brand } from './brand';
import { rowsArtwork } from './rows-artwork';

const swatchOf = (slot: number): SwatchId => brand<SwatchId>(`sw_${String(slot + 3).padStart(6, '0')}`);

const withRamps = (artwork: Artwork): Artwork => {
  const [bank] = artwork.banks;
  if (!bank) throw new Error('the artwork needs a bank');
  const ramps = [
    { id: brand<RampId>('rmp_000090'), name: 'Violet', swatches: [1, 2, 3, 4].map(swatchOf) },
    { id: brand<RampId>('rmp_000091'), name: 'Empty', swatches: [] },
  ];
  return { ...artwork, banks: [{ ...bank, ramps }] };
};

const rampArtwork = (rows: readonly string[]): Artwork => withRamps(rowsArtwork(rows));

export { rampArtwork, withRamps };
