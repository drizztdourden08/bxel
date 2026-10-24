/* @layer renderer-app @kind component */
import { EmptyState, VirtualList } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import type { AssetsPartProps } from '../AssetsView.type';
import { AssetRowItem } from './AssetRowItem';

const AssetList = ({ model }: AssetsPartProps) => {
  if (model.rows.length === 0) {
    return <EmptyState message={model.total === 0 ? ASSET_LIST_TEXT.emptyProject : ASSET_LIST_TEXT.empty} />;
  }
  return (
    <VirtualList
      className="project-assets__list"
      label={ASSET_LIST_TEXT.listLabel}
      rowSize="roomy"
      items={model.rows}
      getKey={(row) => row.id}
      renderItem={(row) => <AssetRowItem model={model} row={row} />}
    />
  );
};

export { AssetList };
