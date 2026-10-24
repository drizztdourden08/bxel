/* @layer renderer-app @kind component */
import { Button, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../../asset-list/asset-list-text.constants';
import type { AssetsPartProps } from './AssetsView.type';
import { AssetFilters } from './sub-components/AssetFilters';
import { AssetList } from './sub-components/AssetList';
import { AssetRename } from './sub-components/AssetRename';
import './AssetsView.css';

const AssetsView = ({ model }: AssetsPartProps) => (
  <Stack gap="sm" className="project-assets">
    <AssetFilters model={model} />
    {model.usersOf && (
      <Flex align="center" justify="between" gap="xs">
        <Text variant="caption" tone="muted">
          {ASSET_LIST_TEXT.showingUsers(model.usersOf.name)}
        </Text>
        <Button variant="ghost" size="xs" onClick={() => model.showUsers(null)}>
          {ASSET_LIST_TEXT.clearUsers}
        </Button>
      </Flex>
    )}
    <AssetRename model={model} />
    <AssetList model={model} />
  </Stack>
);

export { AssetsView };
