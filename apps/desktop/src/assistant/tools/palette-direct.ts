/* @layer renderer-app @kind logic */
import { currentTarget } from '../../editor/current-target';
import { runChange } from '../../palette-change/run-change';
import type { ChangeKind } from '../../palette-change/palette-change.type';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { NO_SPRITE } from './direct-commands.constants';
import { swatchProblem } from './swatch-problem';

const paletteDirect = (kind: ChangeKind, swatch: number, other: number | null, cap: number | null): string | null => {
  const target = currentTarget();
  if (!target) return NO_SPRITE;
  const problem = swatchProblem(kind, swatch, other, target.bank.slots.length);
  if (problem !== null) return problem;
  const request = { kind, documentId: target.documentId, bankId: target.bank.id, swatch, other, cap: cap ?? target.bank.cap };
  const outcome = runChange(useDocumentStore.getState().host, request, 'commit');
  return outcome.ok ? null : outcome.message;
};

export { paletteDirect };
