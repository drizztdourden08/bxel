/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import type { CreatableKind } from '../../../stores/creation-store.type';
import type { PanelPartProps } from '../ProjectPanel.type';
import { NEW_ASSET_KINDS } from '../ProjectPanel.constants';

const AddAssetMenu = ({ model }: PanelPartProps) => (
  <DropdownMenu
    size="xs"
    label={ASSET_LIST_TEXT.newAsset}
    trigger={{ label: ASSET_LIST_TEXT.newAsset, icon: 'plus' }}
    groups={[
      {
        id: 'new-asset',
        items: NEW_ASSET_KINDS.map((kind: CreatableKind) => ({
          id: kind,
          label: ASSET_LIST_TEXT.newKinds[kind],
          onSelect: () => model.newAsset(kind),
        })),
      },
    ]}
  />
);

export { AddAssetMenu };
