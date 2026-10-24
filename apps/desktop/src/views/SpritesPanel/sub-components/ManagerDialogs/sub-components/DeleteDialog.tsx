/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { DELETE_TEXT } from '../../../../../sheet-manager/delete-text.constants';
import { deleteSprites } from '../../../../../sheet/delete-sprites';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useDeletePlan } from '../behavior/useDeletePlan';
import { DeleteRows } from './DeleteRows';
import { DialogFrame } from './DialogFrame';

const DeleteDialog = ({ model }: ManagerModelProps) => {
  const { plan, targets } = useDeletePlan(model);
  return (
    <DialogFrame
      title={DELETE_TEXT.title(targets.length)}
      applyLabel={DELETE_TEXT.confirm}
      danger
      canApply={plan.blocker === null && targets.length > 0}
      onApply={() => deleteSprites(model.ids)}
    >
      <Stack gap="md">
        <Text>{DELETE_TEXT.summary(plan.used, targets.length)}</Text>
        {plan.blocker !== null && <Callout tone="danger">{plan.blocker}</Callout>}
        <DeleteRows impacts={plan.impacts} />
      </Stack>
    </DialogFrame>
  );
};

export { DeleteDialog };
