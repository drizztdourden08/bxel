/* @layer renderer-app @kind component */
import { useDropTarget } from '@drizztdourden08/brock-react';
import { Box, Stack, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { CUSTOMIZE_TEXT, MEMBER_DRAG, SLOT_DRAG } from '../CustomizeTools.constants';
import type { GroupBlockProps, MemberDragPayload, SlotDragPayload } from '../CustomizeTools.type';
import { SlotRow } from './SlotRow';

const GroupBlock = ({ group, slots, hidden, onToggle, onMove, onMoveMember, onStep }: GroupBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  useDropTarget<SlotDragPayload>(ref, {
    accepts: SLOT_DRAG,
    onDrop: (payload) => onMove({ id: payload.id, group: group.id, before: null }),
  });
  useDropTarget<MemberDragPayload>(title, {
    accepts: MEMBER_DRAG,
    onDrop: (payload) => onMoveMember({ member: payload.member, to: null, group: group.id }),
  });
  return (
    <Box ref={ref} role="group" aria-label={CUSTOMIZE_TEXT.group(group.label)}>
      <Box ref={title}>
        <Text variant="caption" tone="muted">
          {group.label}
        </Text>
      </Box>
      <Stack gap="xs">
        {slots.map((slot) => (
          <SlotRow key={slot.id} slot={slot} hidden={hidden} onToggle={onToggle} onMove={onMove} onMoveMember={onMoveMember} onStep={onStep} />
        ))}
      </Stack>
    </Box>
  );
};

export { GroupBlock };
