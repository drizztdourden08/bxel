/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, PaletteBank } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { ChangeRequest } from './palette-change.type';
import { switchSteps } from './switch-steps';

const changeSteps = (bank: PaletteBank, request: ChangeRequest, dest?: PaletteBank): CommandStep[] => {
  if (request.kind === 'switch') return switchSteps(bank, request, dest);
  if (request.kind === 'limit') {
    return [{ name: COMMAND_NAME.paletteResize, targets: null, options: { bankId: bank.id, cap: request.cap } }];
  }
  const swatchId = bank.slots[request.swatch]?.id;
  const otherId = request.other === null ? undefined : bank.slots[request.other]?.id;
  if (request.kind === 'merge') {
    return [{ name: PALETTE_COMMAND_NAME.swatchMerge, targets: null, options: { bankId: bank.id, from: swatchId, into: otherId } }];
  }
  const options = { bankId: bank.id, swatchId, ...(otherId === undefined ? {} : { replacementId: otherId }) };
  return [{ name: PALETTE_COMMAND_NAME.swatchDelete, targets: null, options }];
};

export { changeSteps };
