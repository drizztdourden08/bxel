/* @layer renderer-app @kind component */
import { EmptyState, VirtualList } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import type { ManagerPartProps } from '../ProjectManager.type';
import { ManagerAssetRow } from './ManagerAssetRow';

const AssetRows = ({ model }: ManagerPartProps) => {
  const { rows, total } = model.assets;
  if (rows.length === 0) return <EmptyState size="sm" message={total === 0 ? ASSET_LIST_TEXT.emptyProject : ASSET_LIST_TEXT.empty} />;
  return (
    <VirtualList
      className="project-manager__assets"
      label={ASSET_LIST_TEXT.listLabel}
      rowSize="roomy"
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <ManagerAssetRow model={model} row={row} />}
    />
  );
};

export { AssetRows };
