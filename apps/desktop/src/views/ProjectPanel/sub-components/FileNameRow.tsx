/* @layer renderer-app @kind component */
import { InlineCreateForm } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../../../project/project.constants';
import type { PanelPartProps } from '../ProjectPanel.type';

const FileNameRow = ({ model }: PanelPartProps) => (
  <InlineCreateForm
    compact
    label={PANEL_TEXT.fileNameLabel}
    placeholder={PANEL_TEXT.fileNamePlaceholder}
    submitLabel={PANEL_TEXT.create}
    cancelLabel={PANEL_TEXT.cancel}
    error={model.nameError ?? undefined}
    onCreate={model.createFile}
    onCancel={model.stopNaming}
  />
);

export { FileNameRow };
