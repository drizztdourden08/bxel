/* @layer renderer-app @kind component */
import { Field, Stack, TextInput } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { makeAnimationFrom } from '../../../../../sheet-manager/make-animation-from';
import { FrameModeFields } from '../../../../FrameModeFields';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useAnimateForm } from '../behavior/useAnimateForm';
import { AnimateNote } from './AnimateNote';
import { DialogFrame } from './DialogFrame';

const AnimateDialog = ({ model }: ManagerModelProps) => {
  const form = useAnimateForm(model);
  const { spec, plan, targets, update } = form;
  return (
    <DialogFrame
      title={COMPOSE_TEXT.mergeTitle(targets.length)}
      canApply={plan.blocker === null}
      onApply={() => void makeAnimationFrom(model.ids, plan.name, spec)}
    >
      <Stack gap="md">
        <Field label={COMPOSE_TEXT.name} hint={COMPOSE_TEXT.nameHint}>
          <TextInput autoFocus value={spec.name} placeholder={targets[0]?.name ?? ''} onChange={(event) => update({ name: event.target.value })} />
        </Field>
        <FrameModeFields mode={spec.mode} durationMs={spec.durationMs} onMode={(mode) => update({ mode })} onDuration={(durationMs) => update({ durationMs })} />
        <AnimateNote plan={plan} />
      </Stack>
    </DialogFrame>
  );
};

export { AnimateDialog };
