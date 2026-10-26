/* @layer renderer-app @kind component */
import { PanelContainer, SearchInput, Stack } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import { AddAssetMenu } from '../../ProjectPanel/sub-components/AddAssetMenu';
import { AssetFilters } from '../../ProjectPanel/sub-components/AssetsView/sub-components/AssetFilters';
import { AssetRename } from '../../ProjectPanel/sub-components/AssetsView/sub-components/AssetRename';
import type { ManagerPartProps } from '../ProjectManager.type';
import { AssetChoice } from './AssetChoice';
import { AssetRows } from './AssetRows';

const AssetsSection = ({ model }: ManagerPartProps) => (
  <PanelContainer title={MANAGER_TEXT.assetsTitle} level={3} action={model.editable ? <AddAssetMenu onPick={model.actions.newAsset} /> : undefined}>
    <Stack gap="sm">
      <SearchInput aria-label={MANAGER_TEXT.searchLabel} placeholder={MANAGER_TEXT.searchPlaceholder} value={model.search} onChange={model.setSearch} />
      <AssetFilters model={model.assets} />
      <AssetRename model={model.assets} />
      {model.choice !== null && model.editable && <AssetChoice model={model} row={model.choice} />}
      <AssetRows model={model} />
    </Stack>
  </PanelContainer>
);

export { AssetsSection };
