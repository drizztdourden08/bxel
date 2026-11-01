/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { currentPaletteTarget } from '../palette-panel/current-palette-target';
import { commitPlan } from '../transactions/commit-plan';
import { pastePlan } from './paste-plan';
import { readClipboardText } from './read-clipboard-text';

const pasteColours = async (): Promise<void> => {
  const target = currentPaletteTarget();
  if (!target) return;
  const planned = pastePlan(target.bank, await readClipboardText());
  if (!planned.ok) {
    toast(planned.message, { variant: 'warning' });
    return;
  }
  const failure = commitPlan(target.documentId, planned.plan);
  toast(failure ?? planned.plan.done, { variant: failure === null ? 'success' : 'danger' });
};

export { pasteColours };
