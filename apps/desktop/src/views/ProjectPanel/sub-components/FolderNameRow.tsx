/* @layer renderer-app @kind component */
import { InlineCreateForm } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../../../project/project.constants';
import type { PanelPartProps } from '../ProjectPanel.type';

const FolderNameRow = ({ model }: PanelPartProps) => (
  <InlineCreateForm
    compact
    label={PANEL_TEXT.folderNameLabel}
    placeholder={PANEL_TEXT.folderNamePlaceholder}
    submitLabel={PANEL_TEXT.create}
    cancelLabel={PANEL_TEXT.cancel}
    error={model.folderError ?? undefined}
    onCreate={model.createFolder}
    onCancel={model.stopFolder}
  />
);

export { FolderNameRow };
