/* @layer renderer-app @kind component */
import { Box, DropdownMenu, ListItemRow } from '@drizztdourden08/tessera';
import { KIND_LABEL } from '../../../../../asset-list/asset-list.constants';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import { THUMB_WIDTH } from '../AssetsView.constants';
import type { AssetRowProps } from '../AssetsView.type';
import { assetMenuGroups } from '../behavior/asset-menu-groups';
import { dragProps } from '../behavior/drag-props';
import { AssetName } from './AssetName';
import { AssetThumb } from './AssetThumb';
import { AssetUsers } from './AssetUsers';

const metaOf = ({ row }: Pick<AssetRowProps, 'row'>): string =>
  `${KIND_LABEL[row.kind]} in ${row.folder}${row.loaded ? '' : ` - ${ASSET_LIST_TEXT.notOpened}`}`;

const AssetRowItem = (props: AssetRowProps) => {
  const { model, row } = props;
  const groups = assetMenuGroups(props);
  const label = ASSET_LIST_TEXT.actions(row.name);
  return (
    <Box className="project-assets__row" {...dragProps(row)}>
      <ListItemRow
        media={<AssetThumb row={row} />}
        mediaWidth={THUMB_WIDTH}
        name={<AssetName row={row} />}
        meta={metaOf(props)}
        nameAction={<AssetUsers model={model} row={row} />}
        action={<DropdownMenu size="xs" label={label} groups={groups} trigger={{ label, icon: 'ellipsis', iconOnly: true }} />}
        actionVisibility="always"
        data={{ 'data-asset-id': row.id }}
        onClick={() => model.open(row)}
      />
    </Box>
  );
};

export { AssetRowItem };
