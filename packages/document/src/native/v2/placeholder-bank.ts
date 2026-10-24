/* @layer core @kind logic */
import type { BankId, SwatchId } from '../../model/ids.type';
import type { PaletteBank } from '../../model/palette.type';
import { placeholderBody } from './placeholder-body';
import { PLACEHOLDER_BANK_CAP, PLACEHOLDER_BANK_NAME } from './placeholder.constants';

const placeholderBank = (ownerId: string): PaletteBank => {
  const body = placeholderBody(ownerId);
  return {
    id: `bnk_${body}` as BankId,
    name: PLACEHOLDER_BANK_NAME,
    cap: PLACEHOLDER_BANK_CAP,
    transparent: true,
    slots: [{ id: `sw_${body}` as SwatchId, kind: 'transparent' }],
    ramps: [],
  };
};

export { placeholderBank };
