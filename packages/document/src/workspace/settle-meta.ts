/* @layer core @kind logic */
import type { PaletteBank } from '../model/palette.type';
import type { Sprite } from '../model/sprite.type';
import type { Settled } from './composed.type';
import { MERGE_ISSUE } from './merge-issue.constants';
import { NO_BANK_ID } from './workspace.constants';
import type { WorkspaceMeta } from './workspace-meta.type';

const settleBank = (meta: WorkspaceMeta, banks: readonly PaletteBank[]): Settled => {
  const first = banks[0];
  if (!first || banks.some((bank) => bank.id === meta.defaultBankId)) return { meta, issues: [] };
  const next = { ...meta, defaultBankId: first.id };
  if (meta.defaultBankId === NO_BANK_ID) return { meta: next, issues: [] };
  const message = `The default palette ${meta.defaultBankId} was not found; ${first.name} is the default now.`;
  return { meta: next, issues: [{ code: MERGE_ISSUE.DEFAULT_BANK_MISSING, message, path: null }] };
};

const settleMeta = (meta: WorkspaceMeta, banks: readonly PaletteBank[], sprites: readonly Sprite[]): Settled => {
  const bank = settleBank(meta, banks);
  const cover = bank.meta.coverSpriteId;
  if (cover === null || sprites.some((sprite) => sprite.id === cover)) return bank;
  const message = `The cover sprite ${cover} was not found. The project has no cover now.`;
  const issue = { code: MERGE_ISSUE.COVER_MISSING, message, path: null };
  return { meta: { ...bank.meta, coverSpriteId: null }, issues: [...bank.issues, issue] };
};

export { settleMeta };
