/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { encodeAssetFile } from './encode-asset-file';

const encodePalette = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array => {
  const { banks = [] } = slice.artwork;
  const [bank] = banks;
  if (banks.length !== 1 || !bank) throw new Error('A palette file holds exactly one bank.');
  const header = { kind: ASSET_KIND.palette, id: bank.id, name: bank.name, links: [] };
  return encodeAssetFile(header, { bank }, { preview, blobs: new Map() }, clock);
};

export { encodePalette };
