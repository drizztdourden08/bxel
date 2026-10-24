/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetRef, AssetSlice } from '../../model/asset.type';
import type { PaletteBank } from '../../model/palette.type';
import { RECOVERED_PALETTE_NAME } from './asset-container.constants';
import type { ChosenBank } from './choose-bank.type';

const suppliedBank = (palette: AssetSlice | null, link: AssetRef): PaletteBank | undefined =>
  palette?.kind === ASSET_KIND.palette ? palette.artwork.banks?.find((bank) => bank.id === link.id) : undefined;

const chooseBank = (copy: PaletteBank, links: readonly AssetRef[], palette: AssetSlice | null): ChosenBank => {
  const link = links.find((item) => item.id === copy.id);
  if (!link) return { bank: copy, missing: [] };
  const supplied = suppliedBank(palette, link);
  if (supplied) return { bank: supplied, missing: [] };
  return { bank: { ...copy, name: RECOVERED_PALETTE_NAME }, missing: [link] };
};

export { chooseBank };
