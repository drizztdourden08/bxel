/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { sliceSprites } from '../../../../../sheet-manager/slice-sprites';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useSliceForm } from '../behavior/useSliceForm';
import { DialogFrame } from './DialogFrame';
import { PieceFields } from './PieceFields';
import { PieceNames } from './PieceNames';
import { SliceFields } from './SliceFields';
import { SliceNote } from './SliceNote';

const SliceDialog = ({ model }: ManagerModelProps) => {
  const form = useSliceForm(model);
  const { spec, plan } = form;
  return (
    <DialogFrame title={COMPOSE_TEXT.sliceTitle(form.targets.length)} canApply={plan.error === null} onApply={() => sliceSprites(model.ids, spec)}>
      <Stack gap="md">
        <SliceFields spec={spec} update={form.update} />
        <PieceFields pattern={spec.pattern} start={spec.start} keep={spec.keep} update={form.update} />
        <SliceNote plan={plan} />
        <PieceNames plan={plan} />
      </Stack>
    </DialogFrame>
  );
};

export { SliceDialog };
