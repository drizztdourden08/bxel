/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { renameSprites } from '../../../../../sheet-manager/rename-sprites';
import { useRenameForm } from '../behavior/useRenameForm';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { DialogFrame } from './DialogFrame';
import { RenameFields } from './RenameFields';
import { RenamePreview } from './RenamePreview';

const RenameDialog = ({ model }: ManagerModelProps) => {
  const form = useRenameForm(model);
  return (
    <DialogFrame title={DIALOG_TEXT.renameTitle(form.targets.length)} canApply={form.plan.ok} onApply={() => renameSprites(form.plan)}>
      <Stack gap="md">
        <RenameFields spec={form.spec} update={form.update} />
        <RenamePreview plan={form.plan} />
      </Stack>
    </DialogFrame>
  );
};

export { RenameDialog };
