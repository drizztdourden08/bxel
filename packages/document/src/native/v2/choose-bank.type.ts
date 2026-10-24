/* @layer core @kind types */
import type { AssetRef } from '../../model/asset.type';
import type { PaletteBank } from '../../model/palette.type';

type ChosenBank = { readonly bank: PaletteBank; readonly missing: readonly AssetRef[] };

export type { ChosenBank };
