/* @layer core @kind logic */
import { strToU8 } from 'fflate';
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { canonicalJson } from './canonical-json';
import { writeAssetContainer } from './write-asset-container';

const encodePalette = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array => {
  const { banks = [] } = slice.artwork;
  const [bank] = banks;
  if (banks.length !== 1 || !bank) throw new Error('A palette file holds exactly one bank.');
  return writeAssetContainer({
    header: { kind: ASSET_KIND.palette, id: bank.id, name: bank.name, links: [] },
    savedAt: clock(),
    documentBytes: strToU8(canonicalJson({ bank })),
    preview,
    blobs: new Map(),
  });
};

export { encodePalette };
