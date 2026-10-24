/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { splitSprites } from '../../../../../sheet-manager/split-sprites';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useSplitForm } from '../behavior/useSplitForm';
import { DialogFrame } from './DialogFrame';
import { PieceFields } from './PieceFields';
import { PieceNames } from './PieceNames';

const SplitDialog = ({ model }: ManagerModelProps) => {
  const form = useSplitForm(model);
  const { spec, plan, targets } = form;
  return (
    <DialogFrame
      title={COMPOSE_TEXT.splitTitle(targets.length)}
      canApply={plan.error === null}
      onApply={() => splitSprites(targets.map((sprite) => sprite.id), spec)}
    >
      <Stack gap="md">
        <PieceFields pattern={spec.pattern} start={spec.start} keep={spec.keep} update={form.update} />
        <Text tone="dim">{COMPOSE_TEXT.splitCount(plan.names.length, targets.length)}</Text>
        {form.skipped > 0 && <Text tone="dim">{COMPOSE_TEXT.splitSkipped(form.skipped)}</Text>}
        <PieceNames plan={plan} />
      </Stack>
    </DialogFrame>
  );
};

export { SplitDialog };
