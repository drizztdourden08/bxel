/* @layer core @kind logic */
import { ASSET_KIND } from '../model/asset-format.constants';
import type { AssetSlice } from '../model/asset.type';
import type { BankId } from '../model/ids.type';
import { requireBank } from '../read/require-bank';
import type { SliceContext } from './slice-context.type';

const slicePalette = (context: SliceContext, id: string): AssetSlice => {
  const bank = requireBank(context.artwork, id as BankId);
  return { kind: ASSET_KIND.palette, id, name: bank.name, artwork: { banks: [bank] }, links: [] };
};

export { slicePalette };
