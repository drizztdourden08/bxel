/* @layer renderer-app @kind logic */
import { announce, toast } from '@drizztdourden08/brock-react';
import type { PanelOutcome } from '../../../palette-panel/palette-panel.type';

const reportOutcome = (outcome: PanelOutcome, loud = false): void => {
  if (outcome.message === '') return;
  if (!outcome.ok) {
    toast(outcome.message, { variant: 'danger' });
    return;
  }
  announce(outcome.message);
  if (loud) toast(outcome.message, { variant: 'success' });
};

export { reportOutcome };
