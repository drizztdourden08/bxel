/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useChangeStore } from '../stores/useChangeStore';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useToolStore } from '../stores/useToolStore';
import type { ChangeKind } from './palette-change.type';
import { proposeChange } from './propose-change';

const startChange = (kind: ChangeKind): void => {
  const { host, activeId } = useDocumentStore.getState();
  const { foreground, background } = useToolStore.getState();
  const proposed = proposeChange(kind, activeId === null ? null : host.view(activeId), { foreground, background });
  if (proposed.ok) useChangeStore.getState().propose(proposed.request);
  else toast(proposed.message, { variant: 'info' });
};

export { startChange };
