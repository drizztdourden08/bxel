/* @layer renderer-app @kind logic */
import type { LinkIndex } from '../../workspace/link-index.type';
import type { AssetLinks, MissingLink } from './asset-states.type';

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

export { linksByAsset };
