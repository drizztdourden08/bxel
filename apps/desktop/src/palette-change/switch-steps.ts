/* @layer renderer-app @kind logic */
import type { CommandStep, PaletteBank } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { slotPairs } from '../palette-bank/slot-pairs';
import { spritesTarget } from '../sheet/sprites-target';
import type { ChangeRequest } from './palette-change.type';

const switchSteps = (bank: PaletteBank, request: ChangeRequest, dest: PaletteBank | undefined): CommandStep[] =>
  request.spriteId === undefined || !dest
    ? []
    : [{ name: PALETTE_COMMAND_NAME.paletteAssign, targets: spritesTarget([request.spriteId]), options: { bankId: dest.id, mapping: slotPairs(bank, dest) } }];

export { switchSteps };
