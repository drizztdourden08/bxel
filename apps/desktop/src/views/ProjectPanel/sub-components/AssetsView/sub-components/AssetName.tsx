/* @layer renderer-app @kind component */
import { Badge, Flex, Text } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import type { AssetRow } from '../../../../../asset-list/asset-list.type';

const AssetName = ({ row }: { readonly row: AssetRow }) => (
  <Flex align="center" gap="xs">
    <Text variant="label">{row.name}</Text>
    {row.dirty && <Badge variant="dot" color="warning" label={ASSET_LIST_TEXT.unsaved} />}
  </Flex>
);

export { AssetName };
