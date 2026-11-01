/* @layer renderer-app @kind logic */
import type { AssetRow } from '../../asset-list/asset-list.type';
import { USED_BY_KINDS } from '../../panel-browser/project-browser.constants';
import { tabKeyOf } from '../../panel-browser/tab-key-of';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { keyId } from '../../workspace/key-id';
import type { AssetLinks, AssetState } from './asset-states.type';

const statesOf = (row: AssetRow, links: AssetLinks | null): readonly AssetState[] => {
  const openKeys = new Set(useWorkspaceStore.getState().tabs.map((tab) => keyId(tab.key)));
  const tab = tabKeyOf(row);
  const states: AssetState[] = [];
  if (row.dirty) states.push('unsaved');
  if (tab !== null && openKeys.has(tab)) states.push('open');
  if (links !== null && links.missing.length > 0) states.push('missing');
  if (row.loaded && USED_BY_KINDS.includes(row.kind) && row.usedBy.length === 0) states.push('unused');
  return states;
};

export { statesOf };
