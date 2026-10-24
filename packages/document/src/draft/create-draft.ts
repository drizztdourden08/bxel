/* @layer core @kind logic */
import type { Draft, DraftInput } from './draft.type';

const createDraft = ({ base, ids }: DraftInput): Draft => ({
  base,
  ids,
  created: {},
  warnings: [],
  owned: new Map(),
  baselines: new Map(),
  ops: [],
  project: base,
  recorded: base,
  step: 0,
});

export { createDraft };
