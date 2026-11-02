/* @layer renderer-app @kind component */
import { useDropTarget } from '@drizztdourden08/brock-react';
import { Box, Stack, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { CUSTOMIZE_TEXT } from '../CustomizeTools.constants';
import type { GroupBlockProps, SlotDragPayload } from '../CustomizeTools.type';
import { SLOT_DRAG } from '../slot-drag.constants';
import { SlotRow } from './SlotRow';

const GroupBlock = ({ group, slots, hidden, onToggle, onMove, onStep }: GroupBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useDropTarget<SlotDragPayload>(ref, {
    accepts: SLOT_DRAG,
    onDrop: (payload) => onMove({ id: payload.id, group: group.id, before: null }),
  });
  return (
    <Box ref={ref} role="group" aria-label={CUSTOMIZE_TEXT.group(group.label)}>
      <Text variant="caption" tone="muted">
        {group.label}
      </Text>
      <Stack gap="xs">
        {slots.map((slot) => (
          <SlotRow key={slot.id} slot={slot} hidden={hidden} onToggle={onToggle} onMove={onMove} onStep={onStep} />
        ))}
      </Stack>
    </Box>
  );
};

export { GroupBlock };
