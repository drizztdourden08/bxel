/* @layer core @kind logic */
import type { Draft, DraftInput } from './draft.type';

const createDraft = ({ base, ids, stamp }: DraftInput): Draft => ({
  base,
  ids,
  stamp,
  created: {},
  report: {},
  warnings: [],
  owned: new Map(),
  baselines: new Map(),
  ops: [],
  artwork: base,
  recorded: base,
  step: 0,
});

export { createDraft };
