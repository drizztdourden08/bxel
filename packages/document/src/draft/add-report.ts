/* @layer core @kind logic */
import type { Draft } from './draft.type';

const addReport = (draft: Draft, key: string, amount: number): void => {
  draft.report[key] = (draft.report[key] ?? 0) + amount;
};

export { addReport };
