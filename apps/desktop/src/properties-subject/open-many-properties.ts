/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { PROPERTIES_HUB } from '../config-entry/config-entry.constants';
import type { BrowserEntry } from '../project-browser/project-browser.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { manyItemOf } from './many-item-of';
import { MANY_ROUTE } from './many-subject.constants';
import { useManyStore } from './useManyStore';
import { useSubjectStore } from './useSubjectStore';

const openManyProperties = (entries: readonly BrowserEntry[]): void => {
  useSubjectStore.getState().unpin();
  useManyStore.getState().show({ items: entries.map(manyItemOf), tabId: useWorkspaceStore.getState().activeTab });
  nav.open(`${PROPERTIES_HUB}/${MANY_ROUTE}`);
};

export { openManyProperties };
