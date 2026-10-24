/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import type { AssetRow } from './asset-list.type';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';
import { duplicateFile } from './duplicate-file';
import { duplicateSteps } from './duplicate-steps';
import { rowTab } from './row-tab';

const duplicateLoaded = (row: AssetRow): void => {
  const tab = rowTab(row);
  const { host } = useDocumentStore.getState();
  const artwork = tab ? host.view(tab.documentId)?.state.artwork : undefined;
  const plan = tab && artwork ? duplicateSteps(artwork, tab.key) : null;
  if (!tab || !plan) return;
  const done = runSteps(host, tab.documentId, ASSET_LIST_TEXT.duplicateLabel, plan.steps);
  if (done.ok) toast(ASSET_LIST_TEXT.duplicated(plan.name), { variant: 'success' });
  else toast(ASSET_LIST_TEXT.duplicateFailed(done.error.message), { variant: 'danger' });
};

const duplicateRow = (row: AssetRow): void => {
  if (row.loaded) duplicateLoaded(row);
  else void duplicateFile(row);
};

export { duplicateRow };
