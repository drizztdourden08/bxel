/* @layer renderer-app @kind logic */
import { confirmAction, toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { fileName } from '../files/file-name';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { OpOutcome, Relocation } from './file-ops.type';
import { heldAssetsUnder } from './held-assets';
import { referrersOutside } from './referrers-outside';
import { relocate } from './relocate';

const same = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

const within = (path: string, folder: string): boolean => same(path, folder) || path.toLowerCase().startsWith(`${folder.toLowerCase()}/`);

const planMoves = async (paths: readonly string[], toFolder: string): Promise<readonly Relocation[] | string> => {
  const kit = fileKit();
  if (!kit) return FILE_OPS_TEXT.unavailable;
  const target = toSlashes(toFolder).replace(/\/$/, '');
  if (paths.some((path) => within(target, toSlashes(path)))) return FILE_OPS_TEXT.intoItself;
  const listing = await kit.documents.list(target).catch(() => null);
  if (listing === null) return FILE_OPS_TEXT.unreachable(fileName(target));
  const taken = new Set(listing.entries.map((entry) => entry.name.toLowerCase()));
  const plan: Relocation[] = [];
  for (const path of paths.map(toSlashes)) {
    if (same(parentOf(path), target)) continue;
    const name = fileName(path);
    if (taken.has(name.toLowerCase())) return `${name} is already in that folder.`;
    taken.add(name.toLowerCase());
    plan.push({ from: path, to: `${target}/${name}` });
  }
  return plan.length === 0 ? FILE_OPS_TEXT.nothingToMove : plan;
};

const sure = async (moves: readonly Relocation[]): Promise<boolean> => {
  const others = referrersOutside(moves.flatMap((move) => heldAssetsUnder(move.from))).length;
  if (others === 0) return true;
  return confirmAction({ title: FILE_OPS_TEXT.moveTitle, message: FILE_OPS_TEXT.moveMessage(moves.length, others), confirmLabel: FILE_OPS_TEXT.moveConfirm, cancelLabel: FILE_OPS_TEXT.cancel });
};

const undoMove = (moves: readonly Relocation[]): (() => void) => () => {
  void relocate(moves.map((move) => ({ from: move.to, to: move.from })).reverse()).then((outcome) => {
    if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
  });
};

const moveEntries = async (paths: readonly string[], toFolder: string): Promise<OpOutcome> => {
  const plan = await planMoves(paths, toFolder);
  if (typeof plan === 'string') {
    toast(plan, { variant: 'warning' });
    return { ok: false, message: plan };
  }
  if (!(await sure(plan))) return { ok: false, message: FILE_OPS_TEXT.cancel };
  const outcome = await relocate(plan);
  if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
  else toast(outcome.rewritten > 0 ? FILE_OPS_TEXT.movedLinks(plan.length, outcome.rewritten) : FILE_OPS_TEXT.moved(plan.length), { variant: 'success', action: { label: FILE_OPS_TEXT.undo, onSelect: undoMove(plan) } });
  return outcome;
};

export { moveEntries };
