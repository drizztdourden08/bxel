/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { encodeAssetFile } from './encode-asset-file';
import { sheetToFile } from './sheet-to-file';

const encodeSheet = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array => {
  const file = sheetToFile(slice);
  const header = { kind: ASSET_KIND.sheet, id: file.sheet.id, name: file.sheet.name, links: slice.links };
  return encodeAssetFile(header, file, { preview, blobs: new Map() }, clock);
};

export { encodeSheet };
