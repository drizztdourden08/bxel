/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import type { AssetRow } from './asset-list.type';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';
import { deleteStep } from './delete-step';
import { rowTab } from './row-tab';

const removeLoadedRows = (rows: readonly AssetRow[], notice?: string): void => {
  const tabs = rows.flatMap((row) => {
    const tab = rowTab(row);
    return tab ? [tab] : [];
  });
  const documentId = tabs[0]?.documentId;
  const steps = tabs.flatMap((tab) => deleteStep(tab.key) ?? []) as readonly CommandStep[];
  if (documentId === undefined || steps.length === 0) return;
  const done = runSteps(useDocumentStore.getState().host, documentId, ASSET_LIST_TEXT.trashLabel, steps);
  if (done.ok) toast(notice ?? (rows.length === 1 ? ASSET_LIST_TEXT.removed(rows[0]?.name ?? '') : ASSET_LIST_TEXT.removedMany(rows.length)), { variant: 'info' });
  else toast(ASSET_LIST_TEXT.removeFailed(done.error.message), { variant: 'danger' });
};

export { removeLoadedRows };
