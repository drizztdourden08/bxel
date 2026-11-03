/* @layer renderer-app @kind logic */
import { SHEET_TEXT } from './sheet-text.constants';

const lockMessage = (readOnly: boolean, assistant: string | null): string | null => {
  if (readOnly) return SHEET_TEXT.lock.readOnly;
  return assistant === null ? null : SHEET_TEXT.lock.assistant(assistant);
};

export { lockMessage };
