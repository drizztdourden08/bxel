/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { assetName } from '../workspace/asset-name';
import { linkedKeys } from '../workspace/linked-keys';
import { referrersOf } from '../workspace/referrers-of';
import { LINK_LIMIT, OVERVIEW_KIND_LABEL } from './asset-overview.constants';
import type { LinkRelation, OverviewLink } from './asset-overview.type';

const linkTo = (artwork: Artwork, key: AssetKey, relation: LinkRelation): OverviewLink | null => {
  const name = assetName(artwork, key);
  return name === null ? null : { key, name, kindLabel: OVERVIEW_KIND_LABEL[key.kind], relation };
};

const linksOf = (artwork: Artwork, key: AssetKey): readonly OverviewLink[] => {
  const uses = linkedKeys(artwork, key).map((each) => linkTo(artwork, each, 'uses'));
  const usedBy = referrersOf(artwork, key).map((each) => linkTo(artwork, each, 'usedBy'));
  return [...uses, ...usedBy].filter((each): each is OverviewLink => each !== null).slice(0, LINK_LIMIT);
};

export { linksOf };
