/* @layer renderer-app @kind logic */
import { commands, toast } from '@drizztdourden08/brock-react';
import { FILE_COMMAND, FILE_TEXT, NOTICE_VARIANT } from './files.constants';
import type { FileAction, FileOutcome } from './files.type';

const reportOutcome = (outcome: FileOutcome, action: FileAction): void => {
  if (outcome.kind === 'failed') {
    const saving = action.kind === 'save' || action.kind === 'saveAs' || action.kind === 'saveAll';
    const onSelect = (): void => {
      commands.run(FILE_COMMAND.saveAs);
    };
    toast(outcome.message, { variant: 'danger', ...(saving ? { action: { label: FILE_TEXT.saveAsAction, onSelect } } : {}) });
  } else if (outcome.kind === 'done' && outcome.notice !== null) {
    toast(outcome.notice, { variant: NOTICE_VARIANT[action.kind] });
  }
};

export { reportOutcome };
