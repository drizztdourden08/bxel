/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { AssetFocus } from '../asset-config/asset-config.type';
import { duplicateSteps } from '../asset-list/duplicate-steps';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import { OVERVIEW_LABEL, OVERVIEW_TEXT } from './asset-overview.constants';

const duplicateFocused = (focus: AssetFocus): void => {
  const plan = duplicateSteps(focus.artwork, focus.key);
  if (!plan || focus.readOnly) {
    toast(OVERVIEW_TEXT.failed(focus.readOnly ? OVERVIEW_TEXT.readOnly : OVERVIEW_TEXT.nothing), { variant: 'warning' });
    return;
  }
  const done = runSteps(useDocumentStore.getState().host, focus.documentId, OVERVIEW_LABEL.duplicate, plan.steps);
  if (done.ok) toast(OVERVIEW_TEXT.duplicated(plan.name), { variant: 'success' });
  else toast(OVERVIEW_TEXT.failed(done.error.message), { variant: 'danger' });
};

export { duplicateFocused };
