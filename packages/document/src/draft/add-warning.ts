/* @layer core @kind logic */
import type { Draft } from './draft.type';

const addWarning = (draft: Draft, code: string, message: string): void => {
  draft.warnings.push({ code, step: draft.step, message });
};

export { addWarning };
