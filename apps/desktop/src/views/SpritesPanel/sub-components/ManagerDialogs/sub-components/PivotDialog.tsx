/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { setPivots } from '../../../../../sheet-manager/set-pivots';
import { usePivotForm } from '../behavior/usePivotForm';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { DialogFrame } from './DialogFrame';
import { PivotFields } from './PivotFields';

const PivotDialog = ({ model }: ManagerModelProps) => {
  const pivot = usePivotForm(model);
  return (
    <DialogFrame
      title={DIALOG_TEXT.pivotTitle(pivot.targets.length)}
      canApply={pivot.targets.length > 0}
      onApply={() => setPivots(model.ids, pivot.mode)}
    >
      <Stack gap="md">
        <Text tone="dim">{`${DIALOG_TEXT.pivotNow}: ${pivot.now}`}</Text>
        <PivotFields form={pivot.form} update={pivot.update} />
      </Stack>
    </DialogFrame>
  );
};

export { PivotDialog };
