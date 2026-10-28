/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { ASSET_PAGES, PROPERTIES_HUB } from '../config-entry/config-entry.constants';
import { openProjectSettings } from '../config-entry/open-project-settings';
import { findAssetTab } from '../workspace/find-asset-tab';
import type { SubjectRef } from './properties-subject.type';
import { useSubjectStore } from './useSubjectStore';

/** Opens Properties pinned to one file. A project file opens Project settings instead. */
const openProperties = (ref: SubjectRef | null): void => {
  if (ref === null) {
    useSubjectStore.getState().unpin();
    nav.open(PROPERTIES_HUB);
    return;
  }
  const tab = ref.path === null ? null : findAssetTab(ref.path);
  const key = tab?.key ?? ref.key;
  if (key?.kind === 'project') {
    openProjectSettings();
    return;
  }
  useSubjectStore.getState().pinTo(ref);
  nav.open(key === null || key === undefined ? PROPERTIES_HUB : `${PROPERTIES_HUB}/${ASSET_PAGES[key.kind].overview}`);
};

export { openProperties };
