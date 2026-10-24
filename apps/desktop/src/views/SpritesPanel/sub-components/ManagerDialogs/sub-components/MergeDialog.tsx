/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { mergeSprites } from '../../../../../sheet-manager/merge-sprites';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useMergeForm } from '../behavior/useMergeForm';
import { DialogFrame } from './DialogFrame';
import { MergeFields } from './MergeFields';
import { MergeNote } from './MergeNote';

const MergeDialog = ({ model }: ManagerModelProps) => {
  const form = useMergeForm(model);
  return (
    <DialogFrame
      title={COMPOSE_TEXT.mergeTitle(form.targets.length)}
      canApply={form.plan.blocker === null}
      onApply={() => mergeSprites(model.ids, form.spec)}
    >
      <Stack gap="md">
        <MergeFields spec={form.spec} first={form.targets[0]?.name ?? ''} update={form.update} />
        <MergeNote plan={form.plan} />
      </Stack>
    </DialogFrame>
  );
};

export { MergeDialog };
