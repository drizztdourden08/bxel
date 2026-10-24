/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import type { AssetRowProps } from '../AssetsView.type';

const AssetUsers = ({ model, row }: AssetRowProps) =>
  row.kind === 'sprite' && row.usedBy.length > 0 ? (
    <Button variant="ghost" size="xs" title={ASSET_LIST_TEXT.usedByHint} onClick={() => model.showUsers(row)}>
      {ASSET_LIST_TEXT.usedBy(row.usedBy.length)}
    </Button>
  ) : null;

export { AssetUsers };
