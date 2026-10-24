/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { assetParts } from './asset-parts';
import type { AssetParts } from './asset-parts.type';
import { sheetToFile } from './sheet-to-file';

const sheetParts = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): AssetParts => {
  const file = sheetToFile(slice);
  const header = { kind: ASSET_KIND.sheet, id: file.sheet.id, name: file.sheet.name, links: slice.links };
  return assetParts(header, file, { preview, blobs: new Map() }, clock);
};

export { sheetParts };
