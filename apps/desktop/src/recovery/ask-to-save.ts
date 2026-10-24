/* @layer renderer-app @kind logic */
import { confirmSave } from '@drizztdourden08/brock-react';
import { RECOVERY_TEXT } from './recovery.constants';
import type { CloseAnswer } from './recovery.type';

const askToSave = (name: string): Promise<CloseAnswer> =>
  confirmSave({
    title: RECOVERY_TEXT.closeTitle,
    message: RECOVERY_TEXT.closePrompt(name),
    confirmLabel: RECOVERY_TEXT.closeSave,
    discardLabel: RECOVERY_TEXT.closeDiscard,
    cancelLabel: RECOVERY_TEXT.closeCancel,
  });

export { askToSave };
