/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { KIND_LABEL } from '../../../asset-list/asset-list.constants';
import { canDuplicate } from '../../../asset-list/can-duplicate';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import { isNativeRow } from '../../../project-manager/is-native-row';
import type { ManagerRowProps } from '../ProjectManager.type';

const AssetChoice = ({ model, row }: ManagerRowProps) => (
  <Callout tone="info">
    <Stack gap="sm" role="group" aria-label={MANAGER_TEXT.choiceLabel(row.name)}>
      <Text variant="label">{row.name}</Text>
      <Text variant="caption" tone="muted">
        {MANAGER_TEXT.choiceKind(KIND_LABEL[row.kind], row.folder)}
      </Text>
      <Flex gap="xs" wrap>
        {isNativeRow(row) && (
          <Button size="sm" variant="primary" title={MANAGER_TEXT.inAssetSettingsHint} onClick={() => model.actions.inAssetSettings(row)}>
            {MANAGER_TEXT.inAssetSettings}
          </Button>
        )}
        <Button size="sm" variant={isNativeRow(row) ? 'secondary' : 'primary'} title={MANAGER_TEXT.toEditHint} onClick={() => model.actions.toEdit(row)}>
          {MANAGER_TEXT.toEdit}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => model.assets.startRename(row)}>
          {ASSET_LIST_TEXT.rename}
        </Button>
        {canDuplicate(row) && (
          <Button size="sm" variant="secondary" onClick={() => model.assets.duplicate(row)}>
            {ASSET_LIST_TEXT.duplicate}
          </Button>
        )}
        <Button size="sm" variant="danger" onClick={() => model.assets.trash(row)}>
          {ASSET_LIST_TEXT.trash}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => model.choose(null)}>
          {MANAGER_TEXT.clearChoice}
        </Button>
      </Flex>
    </Stack>
  </Callout>
);

export { AssetChoice };
