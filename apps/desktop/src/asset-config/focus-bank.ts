/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import type { AssetFocus } from './asset-config.type';
import { focusAssetOf } from './focus-asset-of';

const focusBank = (focus: AssetFocus): PaletteBank | undefined => {
  const own = focusAssetOf(focus, 'palette');
  if (own) return own;
  const bankId = focusAssetOf(focus, 'sprite')?.bankId ?? focusAssetOf(focus, 'tileset')?.bankId;
  return focus.artwork.banks.find((bank) => bank.id === bankId);
};

export { focusBank };
