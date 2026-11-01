/* @layer renderer-app @kind logic */
import { ERROR_CODE, findBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { hiddenFailure, mcpFailure } from '@bxel/mcp';
import { buildRamp as build } from '@bxel/palette';
import type { ToolHandler } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import type { BuildRampInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const buildRamp: ToolHandler = (input, context) => {
  const request = input as BuildRampInput;
  const view = viewFor(context, request.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const { artwork, revision } = view.state;
  const bank = findBank(artwork, (request.bankId ?? artwork.defaultBankId) as BankId);
  if (!bank || hiddenAssets(context, request.documentId).has(bank.id)) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.notFound));
  const existing = bank.slots.flatMap((slot, index) => (slot.kind === 'color' && index > 0 ? [{ index, hex: slot.rgb }] : []));
  const built = build({ ...request, baseIndex: request.baseIndex ?? null, existing });
  if (!built) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.rampBase, { path: 'base' }));
  return reply({
    ok: true,
    revision,
    bankId: bank.id,
    steps: built.steps.map((step) => ({ offset: step.offset, hex: step.hex.toUpperCase(), reuses: step.reuses })),
    added: built.added,
    free: Math.max(0, bank.cap - bank.slots.length),
  });
};

export { buildRamp };
