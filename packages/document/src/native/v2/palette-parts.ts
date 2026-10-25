/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { assetParts } from './asset-parts';
import type { AssetParts } from './asset-parts.type';

const paletteParts = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): AssetParts => {
  const { banks = [] } = slice.artwork;
  const [bank] = banks;
  if (banks.length !== 1 || !bank) throw new Error('A palette file holds exactly one bank.');
  const header = { kind: ASSET_KIND.palette, id: bank.id, name: bank.name, links: [] };
  return assetParts(header, { bank }, { preview, blobs: new Map() }, clock);
};

export { paletteParts };
