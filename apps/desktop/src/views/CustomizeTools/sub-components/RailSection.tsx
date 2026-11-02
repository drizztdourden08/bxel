/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import { SLOT_GROUPS } from '../../../editor/tool-catalogue/tool-catalogue.constants';
import { useCatalogueSurface } from '../../../hooks/useCatalogueSurface';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { placeSlot } from '../behavior/place-slot';
import { stepPlacedSlot } from '../behavior/step-placed-slot';
import { CUSTOMIZE_TEXT } from '../CustomizeTools.constants';
import { GroupBlock } from './GroupBlock';

const RailSection = () => {
  const surface = useCatalogueSurface();
  const hidden = useToolPrefsStore((state) => state.hiddenMembers);
  const toggle = useToolPrefsStore((state) => state.toggleHidden);
  useToolPrefsStore((state) => state.layouts);
  const slots = slotsOf(surface);
  return (
    <Stack gap="xs" role="group" aria-label={CUSTOMIZE_TEXT.rail}>
      <Text variant="label">{CUSTOMIZE_TEXT.rail}</Text>
      <Text variant="caption" tone="muted">
        {CUSTOMIZE_TEXT.railHint}
      </Text>
      {SLOT_GROUPS.map((group) => (
        <GroupBlock
          key={group.id}
          group={group}
          slots={slots.filter((slot) => slot.group === group.id)}
          hidden={hidden}
          onToggle={toggle}
          onMove={(move) => placeSlot(surface, move)}
          onStep={(id, step) => stepPlacedSlot(surface, id, step)}
        />
      ))}
    </Stack>
  );
};

export { RailSection };
