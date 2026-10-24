/* @layer renderer-app @kind component */
import { InlineCreateForm } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../../../project/project.constants';
import type { PanelPartProps } from '../ProjectPanel.type';

const RenameRow = ({ model }: PanelPartProps) => (
  <InlineCreateForm
    compact
    label={PANEL_TEXT.renameLabel}
    defaultValue={model.renaming ?? ''}
    submitLabel={PANEL_TEXT.renameSubmit}
    cancelLabel={PANEL_TEXT.cancel}
    error={model.renameError ?? undefined}
    onCreate={model.rename}
    onCancel={model.stopRename}
  />
);

export { RenameRow };
