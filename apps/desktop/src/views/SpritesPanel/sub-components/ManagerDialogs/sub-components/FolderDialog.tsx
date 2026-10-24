/* @layer renderer-app @kind component */
import { Field, Stack, TextInput } from '@drizztdourden08/tessera';
import { FOLDER_TEXT } from '../../../../../sheet-manager/folder-text.constants';
import { renameSprites } from '../../../../../sheet-manager/rename-sprites';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useFolderForm } from '../behavior/useFolderForm';
import { DialogFrame } from './DialogFrame';
import { RenamePreview } from './RenamePreview';

const FolderDialog = ({ model }: ManagerModelProps) => {
  const form = useFolderForm(model);
  return (
    <DialogFrame
      title={FOLDER_TEXT.menuTitle(form.targets.length)}
      canApply={form.plan.ok}
      onApply={() => renameSprites(form.plan, FOLDER_TEXT.label(form.plan.changed))}
    >
      <Stack gap="md">
        <Field label={FOLDER_TEXT.field} hint={FOLDER_TEXT.hint}>
          <TextInput autoFocus value={form.folder} onChange={(event) => form.update(event.target.value)} />
        </Field>
        <RenamePreview plan={form.plan} />
      </Stack>
    </DialogFrame>
  );
};

export { FolderDialog };
