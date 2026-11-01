/* @layer renderer-app @kind component */
import { FormRow, Stack, Text, Toggle } from '@drizztdourden08/tessera';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import { useCatalogueSurface } from '../../../hooks/useCatalogueSurface';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { CUSTOMIZE_TEXT } from '../CustomizeTools.constants';

const RailSection = () => {
  const surface = useCatalogueSurface();
  const hidden = useToolPrefsStore((state) => state.hiddenMembers);
  const toggle = useToolPrefsStore((state) => state.toggleHidden);
  const members = slotsOf(surface).flatMap((slot) => slot.members);
  return (
    <Stack gap="xs" role="group" aria-label={CUSTOMIZE_TEXT.rail}>
      <Text variant="label">{CUSTOMIZE_TEXT.rail}</Text>
      <Text variant="caption" tone="muted">
        {CUSTOMIZE_TEXT.railHint}
      </Text>
      {members.map((member) => (
        <FormRow key={member.id} label={member.label} description={member.description} descriptionOverflow="hint">
          <Toggle aria-label={CUSTOMIZE_TEXT.toggle(member.label)} checked={!hidden.includes(member.id)} onChange={() => toggle(member.id)} />
        </FormRow>
      ))}
    </Stack>
  );
};

export { RailSection };
