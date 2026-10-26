/* @layer renderer-app @kind component */
import { Callout, Field, Stack, TextInput } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { cutStrip } from '../../../../../sheet-manager/cut-strip';
import { FrameModeFields } from '../../../../FrameModeFields';
import { StripFields } from '../../../../StripFields';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useCutStripForm } from '../behavior/useCutStripForm';
import { DialogFrame } from './DialogFrame';

const CutStripDialog = ({ model }: ManagerModelProps) => {
  const { spec, plan, target, blocker, update } = useCutStripForm(model);
  const name = spec.name.trim() === '' ? (target?.name ?? '') : spec.name.trim();
  return (
    <DialogFrame
      title={COMPOSE_TEXT.stripTitle}
      canApply={blocker === null && target !== null}
      onApply={() => {
        if (target) void cutStrip(target.id, name, spec);
      }}
    >
      <Stack gap="md">
        <Field label={COMPOSE_TEXT.name} hint={COMPOSE_TEXT.nameHint}>
          <TextInput autoFocus value={spec.name} placeholder={target?.name ?? ''} onChange={(event) => update({ name: event.target.value })} />
        </Field>
        <StripFields
          spec={spec.strip}
          plan={plan}
          result={spec.result}
          onSpec={(change) => update({ strip: { ...spec.strip, ...change } })}
          onResult={(result) => update({ result })}
        />
        <FrameModeFields mode={null} durationMs={spec.durationMs} onMode={() => undefined} onDuration={(durationMs) => update({ durationMs })} />
        {blocker !== null && plan.error === null && <Callout tone="danger">{blocker}</Callout>}
      </Stack>
    </DialogFrame>
  );
};

export { CutStripDialog };
