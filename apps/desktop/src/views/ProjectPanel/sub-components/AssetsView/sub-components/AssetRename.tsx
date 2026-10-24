/* @layer renderer-app @kind component */
import { InlineCreateForm } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import type { AssetsPartProps } from '../AssetsView.type';

const AssetRename = ({ model }: AssetsPartProps) =>
  model.renaming === null ? null : (
    <InlineCreateForm
      key={model.renaming.id}
      compact
      label={ASSET_LIST_TEXT.renameLabel}
      defaultValue={model.renaming.name}
      submitLabel={ASSET_LIST_TEXT.renameSubmit}
      cancelLabel={ASSET_LIST_TEXT.cancel}
      error={model.renameError ?? undefined}
      onCreate={model.rename}
      onCancel={model.stopRename}
    />
  );

export { AssetRename };
