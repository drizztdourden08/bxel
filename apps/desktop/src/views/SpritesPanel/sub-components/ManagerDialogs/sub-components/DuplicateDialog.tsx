/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { COPY_TEXT } from '../../../../../sheet-manager/copy-text.constants';
import { duplicateNamed } from '../../../../../sheet-manager/duplicate-named';
import { useRenameForm } from '../behavior/useRenameForm';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { DialogFrame } from './DialogFrame';
import { RenameFields } from './RenameFields';
import { RenamePreview } from './RenamePreview';

const DuplicateDialog = ({ model }: ManagerModelProps) => {
  const form = useRenameForm(model, true);
  return (
    <DialogFrame title={COPY_TEXT.title(form.targets.length)} canApply={form.plan.ok} onApply={() => duplicateNamed(form.plan)}>
      <Stack gap="md">
        <RenameFields spec={form.spec} update={form.update} />
        <RenamePreview plan={form.plan} />
      </Stack>
    </DialogFrame>
  );
};

export { DuplicateDialog };
