/* @layer renderer-app @kind component */
import { ContextMenu, DropdownMenu, ListItemRow } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { KIND_LABEL } from '../../../asset-list/asset-list.constants';
import { AssetName } from '../../ProjectPanel/sub-components/AssetsView/sub-components/AssetName';
import { AssetThumb } from '../../ProjectPanel/sub-components/AssetsView/sub-components/AssetThumb';
import { THUMB_WIDTH } from '../../ProjectPanel/sub-components/AssetsView/AssetsView.constants';
import { managerMenuGroups } from '../behavior/manager-menu-groups';
import type { ManagerRowProps } from '../ProjectManager.type';

const metaOf = ({ row }: Pick<ManagerRowProps, 'row'>): string => `${KIND_LABEL[row.kind]} in ${row.folder}`;

const ManagerAssetRow = (props: ManagerRowProps) => {
  const { model, row } = props;
  const groups = managerMenuGroups(props);
  const label = ASSET_LIST_TEXT.actions(row.name);
  const item = (
    <ListItemRow
      media={<AssetThumb row={row} />}
      mediaWidth={THUMB_WIDTH}
      name={<AssetName row={row} />}
      meta={metaOf(props)}
      selected={model.choice?.id === row.id}
      action={model.editable ? <DropdownMenu size="xs" label={label} groups={groups} trigger={{ label, icon: 'ellipsis', iconOnly: true }} /> : undefined}
      actionVisibility="always"
      onClick={() => model.choose(model.choice?.id === row.id ? null : row)}
      onDoubleClick={model.editable ? () => model.actions.toEdit(row) : undefined}
    />
  );
  return model.editable ? (
    <ContextMenu groups={groups} label={label}>
      {item}
    </ContextMenu>
  ) : (
    item
  );
};

export { ManagerAssetRow };
