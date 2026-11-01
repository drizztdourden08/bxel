/* @layer renderer-app @kind logic */
import type { AssetRow } from '../../asset-list/asset-list.type';
import { USED_BY_KINDS } from '../../panel-browser/project-browser.constants';
import { tabKeyOf } from '../../panel-browser/tab-key-of';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import type { LinkIndex } from '../../workspace/link-index.type';
import { keyId } from '../../workspace/key-id';

type AssetState = 'unsaved' | 'open' | 'missing' | 'unused';

type MissingLink = { readonly linkId: string; readonly targetName: string; readonly state: string };

type AssetLinks = { readonly uses: readonly string[]; readonly missing: readonly MissingLink[] };

const NO_LINKS: AssetLinks = { uses: [], missing: [] };

const linksByAsset = (index: LinkIndex): ReadonlyMap<string, AssetLinks> => {
  const found = new Map<string, { uses: string[]; missing: MissingLink[] }>();
  for (const link of index.links) {
    const own = found.get(link.from.assetId) ?? { uses: [], missing: [] };
    if (link.found !== null && !own.uses.includes(link.found.assetId)) own.uses.push(link.found.assetId);
    if (link.state === 'missing') own.missing.push({ linkId: link.linkId, targetName: link.targetName, state: link.state });
    found.set(link.from.assetId, own);
  }
  return found;
};

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

export type { AssetLinks, AssetState, MissingLink };
export { linksByAsset, NO_LINKS, statesOf };
