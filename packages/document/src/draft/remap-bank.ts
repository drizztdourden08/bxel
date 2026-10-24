/* @layer core @kind logic */
import type { Sprite } from '../model/sprite.type';
import { recordPending } from '../history/record-pending';
import { remapCel } from '../pixels/remap-cel';
import type { BankRemap, Draft } from './draft.type';
import { snapshotOwned } from './snapshot-owned';
import { updateArtwork } from './update-artwork';

const remapSprite = (draft: Draft, sprite: Sprite, table: Uint8Array): Sprite => {
  const entries = Object.values(sprite.cels).map((cel) => {
    const pixels = remapCel(cel.pixels, table);
    draft.owned.delete(cel.id);
    draft.baselines.set(cel.id, pixels);
    return [cel.id, { ...cel, pixels }] as const;
  });
  return { ...sprite, cels: Object.fromEntries(entries) };
};

const remapBank = (draft: Draft, remap: BankRemap): void => {
  recordPending(draft);
  snapshotOwned(draft);
  draft.ops.push({ kind: 'cel-remap', bankId: remap.bankId, forward: remap.forward, inverse: remap.inverse });
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    sprites: artwork.sprites.map((sprite) => (sprite.bankId === remap.bankId ? remapSprite(draft, sprite, remap.forward) : sprite)),
  }));
};

export { remapBank };
